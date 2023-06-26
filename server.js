const mysql = require('mysql');
const inquirer = require('inquirer');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'company_db',
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    startApp();
  });