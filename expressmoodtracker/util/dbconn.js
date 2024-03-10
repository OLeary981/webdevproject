const mysql = require('mysql2');

// Create a single database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log(`Database connection successfully created!`);
    }
});

module.exports = connection;