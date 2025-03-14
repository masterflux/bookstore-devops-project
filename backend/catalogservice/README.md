# Bookstore Catalog Service

This is the catalog service for the bookstore application, built with **Express.js** and **PostgreSQL**.

## Features

- Admin authentication using JWT
- Fetch all books
- Fetch books by category
- Secure password hashing with bcrypt
- PostgreSQL database connection using Sequelize

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/xxx/bookstore-catalog-service.git
   cd bookstore-catalog-service
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up a `.env` file in the project root:
   ```
   DATABASE_URL=xxx
   JWT_SECRET=your_jwt_secret
   ```

4. Run in production mode:
   ```sh
   npm start
   ```

## API Endpoints

### **Auth**
- `POST /login` - Authenticate admin and get a JWT token.

### **Books**
- `GET /books` - Fetch all books.
- `GET /books/category/:category` - Fetch books by category.

## License

MIT License
