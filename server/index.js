import express from 'express';
import mysql from 'mysql2/promise'; // Using promise wrapper
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
// Note: User needs to provide their actual MySQL credentials in .env
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fraimiix_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create table if it doesn't exist on server start
async function initDatabase() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                service VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        connection.release();
        console.log('MySQL Database connected and contacts table verified.');
    } catch (error) {
        console.error('MySQL connection/init error:', error);
    }
}
initDatabase();

// Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, service, message } = req.body;

        // Save to MySQL Database
        const [result] = await pool.query(
            'INSERT INTO contacts (name, email, service, message) VALUES (?, ?, ?, ?)',
            [name, email, service, message]
        );

        console.log('Saved new contact request to MySQL. Record ID:', result.insertId);

        // Note: Emailing is now handled exclusively by the React frontend using EmailJS.

        res.status(201).json({ success: true, message: 'Message saved to database successfully.' });

    } catch (error) {
        console.error('Error saving to database:', error);
        res.status(500).json({ success: false, message: 'An error occurred while saving to the database.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
