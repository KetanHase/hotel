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
    cb(null, 'uploads/'); // Folder to store files
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

const getUserDetails = (req, res) => {
    const sql = `
        SELECT 
            book.id, 
            book.name, 
            book.price, 
            book.author, 
            book.stock, 
            book.category_id, 
            category.name AS category_name,
            book.price_category, 
            book.status, 
            book.imageFile
            
             
        FROM book
        
        LEFT JOIN category ON book.category_id = category.id
       ORDER BY book.id DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching user details:", err); // Log the full error
            return res.json({ error: "An error occurred", details: err });
        }
        return res.json(data);
    });
};

const categorizePrice = (price) => {
    if (price < 100) return 'Low';
    if (price >= 100 && price <= 200) return 'Medium';
    return 'High';
};

const changeStatus = (stock) => {
    if (stock > 0) return 'Available';
     return 'Out Of Stock';
     
};

const createUser = (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: "Error uploading image" });
        }
    const priceCategory = categorizePrice(req.body.price);
    const bookstatus = changeStatus(req.body.stock);
    const imageFile = req.file ? req.file.filename : null; // Get the uploaded image
    const sql = "INSERT INTO book (`name`, `author` ,`price` ,`stock`,`category_id`,`price_category`,`status`, `imageFile`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.author,
        req.body.price,
        req.body.stock,
        req.body.category_id,
        
        priceCategory,
        bookstatus,
        imageFile
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    }); 
  });  
};

const updateUser = (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
          return res.status(500).json({ error: "Error uploading image" });
        }
    const priceCategory = categorizePrice(req.body.price);
    const imageFile = req.file ? req.file.filename : null;
    const bookstatus = changeStatus(req.body.stock); 
    
    const sql = "UPDATE book SET `name` = ?, `author` = ?, `price` = ?, `stock` = ?, `category_id` = ?,  `price_category` = ?, `status` = ?" + (imageFile ? ", `imageFile` = ?" : "") + " WHERE ID = ?";
    const values = [
        req.body.name,
        req.body.author,
        req.body.price,
        req.body.stock,
        req.body.category_id,
        
        priceCategory,
        bookstatus

         
    ];
    if (imageFile) values.push(imageFile); // Include image file if uploaded
    values.push(req.params.id);

    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
  });
 };
 
 const deleteuser = (req, res) => {
    const sql = "DELETE FROM book WHERE id = ?";
  
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    });
 };

 const getCategories = (req, res) => {
    const sql = "SELECT * FROM category";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching categories." });
        return res.status(200).json(data);
    });
};

const getLanguages = (req, res) => {
    const sql = "SELECT * FROM language";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching categories." });
        return res.status(200).json(data);
    });
};



module.exports = { getUserDetails ,createUser, updateUser, deleteuser,getCategories,getLanguages};