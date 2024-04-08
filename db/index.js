const mysql = require('mysql')

const db = mysql.createPool({
    // host: '127.0.0.1',
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01'
})
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database with connection id: ' + connection.threadId);

    connection.release();
});
module.exports = db