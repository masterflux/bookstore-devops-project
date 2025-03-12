from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import redis
import requests

app = Flask(__name__)
CORS(app)  # Allow cross-domain requests

# 🔹 Configuring a PostgreSQL Database (Storing Shopping Cart Data)
app.config['SQLALCHEMY_DATABASE_URI'] = (
    "postgresql://bookstore_admin:NewSecurePassword123！@"
    "bookstore-pg-server.postgres.database.azure.com:5432/postgres"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'

db = SQLAlchemy(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Connecting to Redis (storing temporary shopping cart data)
redis_client = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)

# Catalogue microservice address (for commodity information)
CATALOG_SERVICE_URL = "http://127.0.0.1:5000"


# User (administrator) model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)


# Database model (shopping cart items)
class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)  # Separate shopping carts for each user
    book_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)


# Create database tables (executed on first run)
def create_tables():
    db.create_all()
    if not User.query.first():
        hashed_password = bcrypt.generate_password_hash("admin").decode('utf-8')
        db.session.add(User(username="admin", password=hashed_password))
        db.session.commit()


# Administrator login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    if isinstance(access_token, bytes):
        access_token = access_token.decode('utf-8')
    return jsonify({"token": access_token})


# Get Cart (JWT Authentication)
@app.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()

    # Query the database for shopping cart data
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    cart_list = []

    for item in cart_items:
        # Getting product details from catalogue services
        book_data = requests.get(f"{CATALOG_SERVICE_URL}/books/{item.book_id}").json()
        cart_list.append({
            "id": item.id,
            "title": book_data["title"],
            "author": book_data["author"],
            "price": book_data["price"],
            "quantity": item.quantity,
            "total_price": item.quantity * book_data["price"]
        })

    return jsonify(cart_list), 200


@app.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    book = Book.query.get(data['book_id'])

    if not book or book.stock < data['quantity']:
        return jsonify({"error": "Insufficient stock"}), 400

    book.stock -= data['quantity']  # Inventory reduction
    cart_item = Cart(user_id=user_id, book_id=data['book_id'], quantity=data['quantity'])
    db.session.add(cart_item)
    db.session.commit()

    return jsonify({"message": "Added to cart"}), 201

# Update the number of items in the shopping cart
@app.route('/cart/<int:book_id>', methods=['PUT'])
@jwt_required()
def update_cart(book_id):
    user_id = get_jwt_identity()  # Get current user ID
    data = request.get_json()  # Get request data
    quantity = data["quantity"]  # Getting new quantities

    # Query items in the shopping cart
    cart_item = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()
    if not cart_item:
        return jsonify({"error": "Item is not in the shopping cart"}), 404

    # Inventory Enquiry
    book_response = requests.get(f"{CATALOG_SERVICE_URL}/books/{book_id}")
    if book_response.status_code != 200:
        return jsonify({"error": "Book does not exist"}), 404

    book_data = book_response.json()

    # Checking the adequacy of stock
    if book_data["stock"] < quantity:
        return jsonify({"error": f"Insufficient stock, current inventory：{book_data['stock']}"}), 400

    # Update inventory
    new_stock = book_data["stock"] - quantity
    requests.put(f"{CATALOG_SERVICE_URL}/books/{book_id}", json={"stock": new_stock})

    # Update the number of items in the shopping cart
    cart_item.quantity += quantity
    db.session.commit()

    return jsonify({"message": "Shopping cart has been updated and inventory has been reduced"}), 200

@app.route('/cart/<int:book_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(book_id):
    user_id = get_jwt_identity()
    cart_item = Cart.query.filter_by(user_id=user_id, book_id=book_id).first()

    if not cart_item:
        return jsonify({"error": "Item is not in the shopping cart"}), 404

    # Inventory Enquiry
    book_response = requests.get(f"{CATALOG_SERVICE_URL}/books/{book_id}")
    if book_response.status_code != 200:
        return jsonify({"error": "Commodity does not exist"}), 404

    book_data = book_response.json()

    # Restoration of stockpiles
    new_stock = book_data["stock"] + cart_item.quantity
    requests.put(f"{CATALOG_SERVICE_URL}/books/{book_id}", json={"stock": new_stock})

    # Deleting items from the shopping cart
    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({"message": "Item has been removed from the shopping cart and stock has been restored."}), 200

@app.route('/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    if not cart_items:
        return jsonify({"error": "Shopping cart is empty"}), 404

    # Iterate through each item in the shopping cart to restore stock
    for item in cart_items:
        book_response = requests.get(f"{CATALOG_SERVICE_URL}/books/{item.book_id}")
        if book_response.status_code != 200:
            return jsonify({"error": "Commodity does not exist"}), 404

        book_data = book_response.json()
        new_stock = book_data["stock"] + item.quantity
        requests.put(f"{CATALOG_SERVICE_URL}/books/{item.book_id}", json={"stock": new_stock})

    # Delete all items in the shopping cart
    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({"message": "Shopping cart has been emptied and stock has been restored"}), 200

if __name__ == '__main__':
    with app.app_context():  # Ensure that Flask is running with the correct database context
        db.create_all()  # Create Table

        # Check if an administrator account already exists
        if not User.query.first():
            hashed_password = bcrypt.generate_password_hash("admin123").decode('utf-8')
            db.session.add(User(username="admin", password=hashed_password))
            db.session.commit()
            print("User account created: username: admin, password: admin123")
        else:
            print("Administrator account already exists")
    app.run(debug=True, port=5001)
