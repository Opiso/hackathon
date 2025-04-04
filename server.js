const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');

// Initialize SQLite database (ensure the database file exists)
const db = new sqlite3.Database('./portfolio_projects.db');

// Create the server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Serve static files (CSS, JS)
    if (pathname === '/') {
        // Serve the index.html
        fs.readFile(path.join(__dirname, 'views', 'index.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (pathname.startsWith('/static/css')) {
        // Serve CSS files
        const cssPath = path.join(__dirname, 'static', pathname); // Corrected path
        fs.readFile(cssPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('CSS file not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } else if (pathname.startsWith('/static/javascript')) {
        // Serve JS files
        const jsPath = path.join(__dirname, 'static', pathname); // Corrected path
        fs.readFile(jsPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('JS file not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    } else if (pathname === '/api/projects') {
        // Serve the projects data
        const offset = parseInt(parsedUrl.query.offset) || 0;
        const limit = 3;

        db.all('SELECT * FROM projects LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Database error" }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ projects: rows }));
            }
        });
    } else if (pathname === '/api/contact' && req.method === 'POST') {
        // Handle contact form submission
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert buffer to string
        });
        req.on('end', () => {
            const parsedBody = JSON.parse(body);
            const { name, email, message } = parsedBody;
            console.log(`Contact Form Submission: ${name} (${email}) said: ${message}`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Your message has been sent!" }));
        });
    } else {
        // Handle unknown routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
