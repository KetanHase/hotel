const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'admin',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
        maxAge: 1000 * 30  // 1 hour
     }  // Set to true if using HTTPS
}));


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel"
});

 


const UsersFetch = (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
};

const UserRegister = (req, res) => {
    const { username, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserQuery, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, password], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'User registered successfully.' });
        });
    });
};

const UserLogin = (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            req.session.user = results[0];
            res.json({ success: true, user: req.session.user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
};

const UserLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Logout successful' });
    });
};

const UserSession =  (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
};

module.exports = {UsersFetch,UserRegister,UserLogin,UserLogout,UserSession};

