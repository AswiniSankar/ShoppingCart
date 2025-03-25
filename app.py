from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from flask_bcrypt import Bcrypt
from datetime import datetime
from flask_cors import CORS


app = Flask(__name__)
api = Api(app)
CORS(app) 
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"  # Using SQLite DB
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# User Model
class User(db.Model):
    __tablename__ = 'users' 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True)
    is_guest = db.Column(db.Boolean, default=False, nullable=False)

# Product Model
class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    image_url = db.Column(db.String(255))
    stock = db.Column(db.Integer, nullable=False)

# Order Model
class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="orders")
    product = db.relationship("Product", backref="orders")

#Cart Model
class Cart(db.Model):
    __tablename__ = 'cart'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    product = db.relationship('Product', backref='cart_items')


# Creating the Database Tables
with app.app_context():
    db.create_all()

# API Resource for Product
class ProductResource(Resource):
    def get(self, product_id=None):
        if product_id:
            product = Product.query.get(product_id)
            if not product:
                return {"message": "Product not found."}, 404
            return {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "description": product.description,
                "image_url": product.image_url,
                "stock": product.stock
            }, 200
        else:
            products = Product.query.all()
            return {"products": [{
                "id": p.id, "name": p.name, "price": p.price,
                "description": p.description, "image_url": p.image_url,
                "stock": p.stock} for p in products]}, 200

    def post(self):
        data = request.json
        if not data or "name" not in data or "price" not in data:
            return {"message": "Name and Price are required"}, 400

        new_product = Product(
            name=data["name"],
            price=data["price"],
            description=data.get("description", ""),
            image_url=data.get("image_url", ""),
            stock=data.get("stock", 0)
        )
        db.session.add(new_product)
        db.session.commit()
        return {"message": "Product added successfully!", "id": new_product.id}, 201
#update product
    def put(self, product_id):
        data = request.json
        product = Product.query.get(product_id)

        if not product:
            return {"message": "Product not found."}, 404

        # Update existing product fields safely
        product.name = data.get("name", product.name)
        product.price = data.get("price", product.price)
        product.description = data.get("description", product.description)
        product.image_url = data.get("image_url", product.image_url)
        product.stock = data.get("stock", product.stock)

        # Commit changes to the database
        db.session.commit()

        return {
            "message": "Product updated successfully",
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "description": product.description,
            "image_url": product.image_url,
            "stock": product.stock
        }, 200
    #Delete Product based on product id
    def delete(self, product_id):
        product = Product.query.get(product_id)

        if not product:
            return {"message": "Product not found."}, 404

        # Delete the product from the database
        db.session.delete(product)
        db.session.commit()

        return {"message": "Product deleted successfully", "id": product_id}, 200






# API Resource for User Authentication
class UserAuth(Resource):
    def post(self, action):
        data = request.json

        # 1. **Sign in as Guest (Requires Name, Email, Contact, and Payment Details, No Password)**
        if action == "guest":
            if not data or "name" not in data or "email" not in data:
                return {"message": "Name, Email Details are required for guest users."}, 400

            # Querying for an existing guest user
            existing_user = User.query.filter_by(email=data["email"]).first()
            if existing_user:
                return {"message": "Email is already a guest user. Please sign in."}, 400

            guest_user = User(
                name=data["name"], 
                email=data["email"], 
                is_guest=True,
                #contact=data["contact"],  # Add contact info
                #payment_details=data["payment_details"]  # Add payment details
            )
            db.session.add(guest_user)
            db.session.commit()
            return {"message": "Guest user created successfully!", "user_id": guest_user.id}, 201

        # 2. **Sign up as New User (Requires Name, Email, Password, Contact, and Payment Details)**
        elif action == "signup":
            if not data or "name" not in data or "email" not in data or "password" not in data:
                return {"message": "Name, Email, Password, are required."}, 400

            existing_user = User.query.filter_by(email=data["email"]).first()
            if existing_user:
                return {"message": "Email is already registered. Please sign in."}, 400

            hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
            new_user = User(
                name=data["name"],
                email=data["email"],
                password=hashed_password,
                is_guest=False,
                #contact=data["contact"],  # Add contact info
                #payment_details=data["payment_details"]  # Add payment details
            )
            db.session.add(new_user)
            db.session.commit()
            return {"message": "User registered successfully!", "user_id": new_user.id}, 201

        # 3. **Sign in for Existing User (Requires Email and Password)**
        elif action == "signin":
            if not data or "email" not in data or "password" not in data:
                return {"message": "Email and Password are required."}, 400

            user = User.query.filter_by(email=data["email"], is_guest=False).first()
            if not user:
                return {"message": "Invalid email. User not found."}, 404

            if not bcrypt.check_password_hash(user.password, data["password"]):
                return {"message": "Invalid password. Please try again."}, 401

            return {"message": "Sign-in successful!", "user_id": user.id,
            "name": user.name,"email": user.email }, 200

        else:
            return {"message": "Invalid action. Use 'guest', 'signup', or 'signin'."}, 400

class UserList(Resource):
    def get(self):
        page = request.args.get("page", default=1, type=int)
        per_page = request.args.get("per_page", default=10, type=int)
        is_guest = request.args.get("is_guest", default=None, type=str)

        query = User.query

        # Apply filter if 'is_guest' is provided in the request
        if is_guest is not None:
            query = query.filter_by(is_guest=is_guest.lower() in ["true", "1"])

        users = query.paginate(page=page, per_page=per_page, error_out=False)

        if not users.items:
            return {"message": "No users found."}, 404

        user_list = [
            {"id": user.id, "name": user.name, "email": user.email, "is_guest": user.is_guest} 
            for user in users.items
        ]
        
        return {
            "users": user_list,
            "total_users": users.total,
            "page": users.page,
            "per_page": users.per_page,
            "total_pages": users.pages
        }, 200

# API Resource for Place Order
class PlaceOrder(Resource):
    def post(self):
        data = request.json
        if not data or "product_id" not in data or "quantity" not in data:
            return {"message": "Product ID and Quantity are required."}, 400

        product = Product.query.get(data["product_id"])
        if not product:
            return {"message": "Product not found."}, 404

        if product.stock < data["quantity"]:
            return {"message": "Not enough stock available."}, 400

        user_id = data.get("user_id")
        if user_id:
            user = User.query.get(user_id)
            if not user:
                return {"message": "User not found."}, 404
        else:
            if "name" not in data or "email" not in data:
                return {"message": "Guest users must provide Name and Email."}, 400
            user = User.query.filter_by(email=data["email"], is_guest=True).first()
            if not user:
                user = User(name=data["name"], email=data["email"], is_guest=True)
                db.session.add(user)
                db.session.commit()

        total_price = product.price * data["quantity"]
        new_order = Order(
            user_id=user.id,
            product_id=product.id,
            quantity=data["quantity"],
            total_price=total_price
        )
        db.session.add(new_order)
        product.stock -= data["quantity"]
        db.session.commit()
        return {"message": "Order placed successfully!", "order_id": new_order.id}, 201

# API Resource for Add to Cart
class CartResource(Resource):
    def post(self):
        """Add a product to the cart"""
        data = request.get_json()
        
        product_id = data.get("product_id")
        quantity = data.get("quantity", 1)  # Default to 1 if not provided
        
        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            return {"message": "Product not found"}, 404

        # Check if the product is already in cart
        cart_item = Cart.query.filter_by(product_id=product_id).first()
        if cart_item:
            cart_item.quantity += quantity  # Increase quantity if already in cart
        else:
            cart_item = Cart(product_id=product_id, quantity=quantity)
            db.session.add(cart_item)
        
        db.session.commit()

        return {
            "message": "Product added to cart",
            "cart_item": {
                "id": cart_item.id,
                "product_id": cart_item.product_id,
                "quantity": cart_item.quantity,
                "product_name": product.name,
                "product_price": product.price
            }
        }, 201

        
# API Route Registration
api.add_resource(ProductResource, '/products', '/products/<int:product_id>')
api.add_resource(PlaceOrder, '/orders')
api.add_resource(UserAuth, "/user/<string:action>")
api.add_resource(UserList,"/user")
api.add_resource(CartResource,"/cart")

if __name__ == '__main__':
    app.run(debug=True)
