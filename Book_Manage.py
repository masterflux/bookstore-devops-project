from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = (
    "postgresql://bookstore_admin:NewSecurePassword123！@"
    "bookstore-pg-server.postgres.database.azure.com:5432/postgres"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


# Admin model
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)


# Book model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)


# Create database tables (run this on first execution)
def create_tables():
    db.create_all()
    if not Admin.query.first():
        hashed_password = bcrypt.generate_password_hash("admin123").decode('utf-8')
        db.session.add(Admin(username="admin", password=hashed_password))
        db.session.commit()


# Admin login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    admin = Admin.query.filter_by(username=data['username']).first()

    if not admin or not bcrypt.check_password_hash(admin.password, data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=admin.username)
    if isinstance(access_token, bytes):
        access_token = access_token.decode('utf-8')
    return jsonify({"token": access_token})


# Get all books (requires admin permission)
@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify(
        [{"id": b.id, "title": b.title, "author": b.author, "price": b.price, "stock": b.stock} for b in books])


@app.route('/books/<int:book_id>', methods=['GET'])
def get_single_book(book_id):
    book = Book.query.get(book_id)
    if book:
        return jsonify({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "price": book.price,
            "stock": book.stock
        })
    else:
        return jsonify({"error": "Book not found"}), 404


# Add a book
@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    new_book = Book(title=data['title'], author=data['author'], price=data['price'], stock=data['stock'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added"}), 201


# Update a book
@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    print(f"Received PUT request for book {book_id}")
    print(f"Request Headers: {request.headers}")
    print(f"Request Body: {request.get_json()}")
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    data = request.get_json()
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.price = data.get('price', book.price)
    book.stock = data.get('stock', book.stock)

    db.session.commit()
    return jsonify({"message": "Book updated"})


# Delete a book
@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted"})


if __name__ == '__main__':
    with app.app_context():  # Ensure correct database context while running Flask
        db.create_all()  # Create tables

        # Check if admin account exists
        if not Admin.query.first():
            hashed_password = bcrypt.generate_password_hash("admin123").decode('utf-8')
            db.session.add(Admin(username="admin", password=hashed_password))
            db.session.commit()
            print("Admin account created: Username: admin, Password: admin123")
        else:
            print("Admin account already exists")

    app.run(debug=True)
