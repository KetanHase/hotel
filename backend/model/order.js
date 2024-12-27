const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel"
});

db.connect(err => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database.");
});

const createLanguage = (req, res) => {
    const sql = "INSERT INTO language (`name`) VALUES (?)";
    const values = [
        req.body.name
      
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });   
};

const updateLanguage = (req, res) => {
    const sql = "update language set `name` = ?  WHERE ID = ?";
    const values = [
        req.body.name
       
    ];
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
 };

 const deleteLanguage = (req, res) => {
    const sql = "DELETE FROM language WHERE id = ?";
  
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
 };

module.exports = { createLanguage ,updateLanguage,deleteLanguage};