const mysql = require('mysql2');

const mydb = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT //had to add this in to connect to database.
});

mydb.connect( (err) => {
    if (err) throw err;

    console.log('Database connected!');
});

module.exports = mydb;