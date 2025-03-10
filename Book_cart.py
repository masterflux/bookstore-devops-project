from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import redis
import json
import requests

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 🔹 配置 PostgreSQL 数据库（存储购物车数据）
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

# 🔹 连接 Redis（存储临时购物车数据）
redis_client = redis.StrictRedis(host='localhost', port=6379, decode_responses=True)

# 🔹 目录微服务地址（用于获取商品信息）
CATALOG_SERVICE_URL = "http://127.0.0.1:5000"


# 用户（管理员）模型
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)


# 数据库模型（购物车项）
class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)  # 每个用户的购物车独立
    product_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)


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


# ✅ 获取购物车（JWT 认证）
# 获取购物车（JWT认证）
@app.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()

    # 查询数据库获取购物车数据
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    cart_list = []

    for item in cart_items:
        # 从目录服务获取商品详情
        product_data = requests.get(f"{CATALOG_SERVICE_URL}/books/{item.product_id}").json()
        cart_list.append({
            "id": item.id,
            "title": product_data["title"],
            "author": product_data["author"],
            "price": product_data["price"],
            "quantity": item.quantity,
            "total_price": item.quantity * product_data["price"]
        })

    return jsonify(cart_list), 200


@app.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data["product_id"]
    quantity = data["quantity"]

    # 🔍 检查目录服务是否存在该商品，使用 id 进行查询
    product_response = requests.get(f"{CATALOG_SERVICE_URL}/books/{product_id}")
    print(f"Product response status: {product_response.status_code}")
    print(f"Product response content: {product_response.text}")  # 输出返回的响应内容

    if product_response.status_code != 200:
        return jsonify({"error": "商品不存在"}), 404

    product_data = product_response.json()

    # ✅ 检查库存是否足够
    if product_data["stock"] < quantity:
        return jsonify({"error": "库存不足"}), 400

    # ✅ 将商品添加到数据库购物车
    existing_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(new_item)

    db.session.commit()
    return jsonify({"message": "商品已添加到购物车"}), 201

# ✅ 更新购物车商品数量
@app.route('/cart/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_cart(product_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    quantity = data["quantity"]

    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not cart_item:
        return jsonify({"error": "商品不在购物车中"}), 404

    # 检查库存
    product_response = requests.get(f"{CATALOG_SERVICE_URL}/books/{product_id}")
    if product_response.status_code != 200:
        return jsonify({"error": "商品不存在"}), 404

    product_data = product_response.json()
    if product_data["stock"] < quantity:
        return jsonify({"error": "库存不足"}), 400

    cart_item.quantity = quantity
    db.session.commit()
    return jsonify({"message": "购物车已更新"}), 200


# ✅ 删除购物车商品
@app.route('/cart/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(product_id):
    user_id = get_jwt_identity()
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()

    if not cart_item:
        return jsonify({"error": "商品不在购物车中"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "商品已从购物车删除"}), 200


# ✅ 清空购物车
@app.route('/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "购物车已清空"}), 200


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
    app.run(debug=True, port=5001)
