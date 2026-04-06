const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("DB connection error:", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.get("/init", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users(
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255)
    )
  `;
  db.query(sql, () => res.send("Table created"));
});

app.post("/user", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO users(name) VALUES(?)", [name], () => {
    res.send("User added");
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    res.json(result);
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
