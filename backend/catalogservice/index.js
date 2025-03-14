const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'bookstore_admin',
    host: 'bookstore-pg-server.postgres.database.azure.com',
    database: 'postgres',
    password: 'NewSecurePassword123!',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});


// Get all books
app.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM book');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get books by category
app.get('/books/category/:category', async (req, res) => {
    const { category } = req.params;
    const categoryMap = {
        fiction: 0,
        science: 1,
        history: 2,
    };
    try {
        const result = await pool.query('SELECT * FROM book WHERE category = $1', [categoryMap[category]]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No books found in this category' });
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:` + port);
});

