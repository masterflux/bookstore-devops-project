from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域访问

# 配置数据库
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


# 用户（管理员）模型
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)


# 书籍模型
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)


# 创建数据库表（首次运行时执行）
def create_tables():
    db.create_all()
    if not Admin.query.first():
        hashed_password = bcrypt.generate_password_hash("admin123").decode('utf-8')
        db.session.add(Admin(username="admin", password=hashed_password))
        db.session.commit()


# 管理员登录
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


# 获取所有书籍（需要管理员权限）
@app.route('/books', methods=['GET'])
@jwt_required()
def get_books():
    books = Book.query.all()
    return jsonify(
        [{"id": b.id, "title": b.title, "author": b.author, "price": b.price, "stock": b.stock} for b in books])


# 添加书籍
@app.route('/books', methods=['POST'])
@jwt_required()
def add_book():
    data = request.get_json()
    new_book = Book(title=data['title'], author=data['author'], price=data['price'], stock=data['stock'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added"}), 201


# 修改书籍
@app.route('/books/<int:book_id>', methods=['PUT'])
@jwt_required()
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


# 删除书籍
@app.route('/books/<int:book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted"})

if __name__ == '__main__':
    with app.app_context():  # 确保 Flask 运行时有正确的数据库上下文
        db.create_all()  # 创建表

        # 检查是否已存在管理员账户
        if not Admin.query.first():
            hashed_password = bcrypt.generate_password_hash("admin123").decode('utf-8')
            db.session.add(Admin(username="admin", password=hashed_password))
            db.session.commit()
            print("✅ 管理员账户已创建：用户名：admin，密码：admin123")
        else:
            print("✅ 管理员账户已存在")

    app.run(debug=True)