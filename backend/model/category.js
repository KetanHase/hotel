const mysql = require("mysql");
const multer = require('multer');
const path = require('path');

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/category'); // Folder to store files
    },
    /*filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }*/
      filename: function (req, file, cb) {
          // Get today's date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0];
          
          // Combine today's date with the original file name
          const fileName = `${today}-${file.originalname}`;
          
          // Pass the filename to the callback
          cb(null, fileName);
        }
  });
  
  const upload = multer({ storage: storage });

const createCategory = (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: "Error uploading image" });
        }
    const image  = req.file ? req.file.filename : null;
    const sql = "INSERT INTO category (`name`,`image`) VALUES (?)";
    const values = [
        req.body.name,
        image
      
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });   
  });
};

const updateCategory = (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
          return res.status(500).json({ error: "Error uploading image" });
        }
     
    const image = req.file ? req.file.filename : null; 

    const sql = "UPDATE category SET `name` = ? " + 
             (image ? ", `image` = ?" : "") + 
             " WHERE ID = ?";
    const values = [
        req.body.name
       
    ];

     if (image) values.push(image); // Include image file if uploaded
    values.push(req.params.id);
    const id = req.params.id;

    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
    });
 };

 const deleteCategory = (req, res) => {
    const sql = "DELETE FROM category WHERE id = ?";
  
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
 };

module.exports = { createCategory ,updateCategory,deleteCategory};