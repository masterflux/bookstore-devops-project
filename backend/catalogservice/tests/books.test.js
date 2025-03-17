const http = require('http');
const { app, pool } = require('../index');

let server;

function httpGet(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3003,
            path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                res.body = data;
                resolve(res);
            });
        });

        req.on('error', (err) => reject(err));
        req.end();
    });
}

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3003, done);
});

afterAll(async () => {
    await pool.end();
    server.close();
});

describe('GET /books', () => {
    it('should return all books', async () => {
        const res = await httpGet('/books');
        expect(res.statusCode).toBe(200);
        const books = JSON.parse(res.body);
        expect(Array.isArray(books)).toBe(true);
    });
});

describe('GET /books/category/:category', () => {
    it('should return books in the specified category', async () => {
        const res = await httpGet('/books/category/fiction');
        expect(res.statusCode).toBe(200);
        const books = JSON.parse(res.body);
        expect(Array.isArray(books)).toBe(true);
    });

    it('should return 404 if no books are found', async () => {
        const res = await httpGet('/books/category/nonexistent');
        expect(res.statusCode).toBe(404);
        const result = JSON.parse(res.body);
        expect(result.message).toBe('No books found in this category');
    });
});
