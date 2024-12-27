const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

 
const { getUserDetails, createUser ,updateUser ,deleteuser,getCategories,getLanguages} = require('./model/user');

const {UsersFetch,UserRegister,UserLogin,UserLogout,UserSession} = require('./model/login');
const {createCategory,updateCategory,deleteCategory} = require('./model/category');
const {createLanguage,updateLanguage,deleteLanguage} = require('./model/language');
const cartRoutes = require('./model/cart');


const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/category', express.static(path.join(__dirname, 'uploads/category')));

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

app.use(cors({
    origin: ['http://localhost:3000','http://localhost:3001'],
    credentials: true
}));

 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'admin',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
      //maxAge: 1000 * 30 ,// 30 seconds
    maxAge: 1000 * 60 * 30 ,
    sameSite: 'lax'   // 30 minutes 

     }  // Set to true if using HTTPS
}));

//app.use('/api', cartRoutes);
//Book Route
app.get("/", getUserDetails);
app.post('/create',createUser); 
app.put('/update/:id',updateUser);
app.delete('/delete/:id',deleteuser);
app.get('/categories', getCategories);
app.get('/languages', getLanguages);

//Login Route
app.get("/user", UsersFetch); 
app.post('/register',UserRegister);  
app.post('/login',UserLogin);
app.post('/logout',UserLogout);
app.get("/check-session", UserSession);


//Category Route
app.post('/category/create',createCategory); 
app.put('/category/update/:id',updateCategory);
app.delete('/category/delete/:id',deleteCategory);

//Language Route
app.post('/language/create',createLanguage); 
app.put('/language/update/:id',updateLanguage);
app.delete('/language/delete/:id',deleteLanguage);

app.post('/cart/add', (req, res) => {
    const { userId, bookId, quantity } = req.body;
    const query = `
      INSERT INTO cart (user_id, book_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + ?`;
  
    db.query(query, [userId, bookId, quantity, quantity], (err, result) => {
      if (err) {
        console.error('Error adding book to cart:', err);
        res.status(500).send('Error adding book to cart');
      } else {
        res.status(200).send('Book added to cart');
      }
    });
  });
  
  // Get cart details for a user
  app.get('/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    
    const query = `
      SELECT c.user_id, b.id as book_id,c.id as itemId, b.name, b.imageFile, b.price,b.author, c.quantity
      FROM cart c
      JOIN book b ON c.book_id = b.id
      WHERE c.user_id = ?`; 
  
    db.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Error fetching cart data:', err);
          return res.status(500).json({ error: 'Error fetching cart data' });
        }

        if (results.length === 0) {
          return res.status(404).json({ cartItems: [], totalAmount: 0 });
        }

        const totalAmount = results.reduce((sum, item) => {
          const price = parseFloat(item.price);
          const quantity = parseInt(item.quantity, 10);
          if (isNaN(price) || isNaN(quantity)) {
            console.error(`Invalid price or quantity in cart: ${item}`);
            return sum; // Skip the item if price or quantity is invalid
          }
          return sum + price * quantity;
        }, 0);

        res.status(200).json({ cartItems: results, totalAmount });
    });
});

app.post('/cart/clear/:userId', (req, res) => {
    const userId = req.params.userId;
    
    // Define the SQL query to delete all items in the cart for the given user
    const query = 'DELETE FROM cart WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error clearing cart:', err);
            return res.status(500).json({ error: 'Error clearing cart' });
        }

        // Send a success response
        res.status(200).json({ message: 'Cart cleared successfully' });
    });
});

app.post('/cart/update', (req, res) => {
    const { bookId, quantity } = req.body;
  
    // Assuming you have a MySQL or similar query setup
    const sql = 'UPDATE cart SET quantity = ? WHERE id = ?';
    db.query(sql, [quantity, bookId], (err, result) => {
      if (err) {
        console.error('Error updating cart item:', err);
        return res.status(500).send('Error updating cart item');
      }
      res.send({ message: 'Quantity updated successfully' });
    });
  });

  app.get('/book/category/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const query = 'SELECT * FROM book WHERE category_id = ?';
    
    db.query(query, [categoryId], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(result);
    });
  });

  // Delete a cart item
  app.delete('/cart/remove/:itemId', (req, res) => {
    const sql = "DELETE FROM cart WHERE id = ?";
    const itemId = req.params.itemId;
    //console.log('Cart item ID :', itemId); 
  
    
    db.query(sql, [itemId], (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Error deleting the item' });
      }
      return res.status(200).json({ message: 'Item removed successfully' });
    });
  });

 // const { v4: uuidv4 } = require('uuid');
// Create a new order
app.post('/orders/create', (req, res) => {
  const { userId, address, city, postalCode, phone, email, card_number, expiry, cvv, totalAmount, items } = req.body;

  const sqlOrder = 'INSERT INTO orders (user_id, address, city, postalCode, phone, email, card_number, expiry, cvv, status, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sqlOrder, [userId, address, city, postalCode, phone, email, card_number, expiry, cvv,'completed', totalAmount], (err, result) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).send('Error creating order');
    }

    // Get the newly created order ID
    const orderId = result.insertId;

    // Insert each item into the order_items table
    const sqlItem = 'INSERT INTO order_items (order_id, item_name, item_quantity) VALUES (?, ?, ?)';
    const itemPromises = items.map(item => {
      return new Promise((resolve, reject) => {
        db.query(sqlItem, [orderId, item.name,item.quantity], (err) => {
          if (err) {
            console.error('Error inserting order item:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    // Wait for all item inserts to complete
    Promise.all(itemPromises)
      .then(() => {
        res.send({ message: 'Order created successfully with items' });
      })
      .catch((err) => {
        console.error('Error inserting order items:', err);
        res.status(500).send('Error inserting order items');
      });
  });
});



// Get orders for a specific user
app.get('/orders/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      o.id AS order_id,
      o.user_id,
      o.address,
      o.city,
      o.postalCode,
      o.phone,
      o.email,
      o.card_number,
      o.expiry,
      o.cvv,
      o.status,
      o.totalAmount,
      o.created_at,
      oi.item_name,
      oi.item_quantity

    FROM 
      orders o
    LEFT JOIN 
      order_items oi ON o.id = oi.order_id
    WHERE 
      o.user_id = ?
    ORDER BY 
      o.id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    // Group orders by order_id
    const orders = results.reduce((acc, row) => {
      const { order_id, user_id, address, city, postalCode, phone, email, card_number, expiry, cvv, totalAmount,created_at,item_name, item_quantity,status  } = row;

      if (!acc[order_id]) {
        acc[order_id] = {
          order_id,
          user_id,
          address,
          city,
          postalCode,
          phone,
          email,
          card_number,
          expiry,
          cvv,
          totalAmount,
          created_at,
          status,
          items: []
        };
      }

      if (item_name) {
        acc[order_id].items.push({ name: item_name, quantity: item_quantity });
      }

      return acc;
    }, {});

    res.json(Object.values(orders));
  });
});

{/* 
//Get orders for admin
app.get('/admin/orders', (req, res) => {
  const sql = 'SELECT * FROM orders'; // Adjust the SQL if you need specific fields
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).send('Error fetching orders');
    }
    res.json(results); // Send the retrieved orders as JSON
  });
});
*/}


// Assuming orders and order_items are the tables
app.get('/admin/orders', (req, res) => {
  const sql = `
    SELECT o.id AS order_id, o.address, o.city, o.postalCode, o.totalAmount, o.created_at, oi.item_name , oi.item_quantity, o.status
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).send('Error fetching orders');
    }
    
    // You might need to format the results so that items are grouped under the respective order
    const ordersMap = results.reduce((acc, row) => {
      const order = acc[row.order_id] || {
        order_id: row.order_id,
        address: row.address,
        city: row.city,
        postalCode: row.postalCode,
        totalAmount: row.totalAmount,
        created_at: row.created_at,
        status: row.status,
        items: [],
      };
      order.items.push({ name: row.item_name, quantity: row.item_quantity });
      acc[row.order_id] = order;
      return acc;
    }, {});

    const orders = Object.values(ordersMap);
    res.json(orders);
  });
});

//update order status
app.put('/admin/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).send('Error updating order status');
    }

    res.send('Order status updated successfully');
  });
});

{/* Contact Form Api */}
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill out all fields.' });
  }

  const query = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
  db.query(query, [name, email, message], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to submit message' });
    }
    res.status(200).json({ message: 'Message sent successfully!' });
  });
});

app.get('/getcontact', (req, res) => {
  const sql = "SELECT * FROM contact";
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching Email:', err);
      return res.status(500).json({ message: "Error fetching Email." });
    }
    return res.status(200).json(data);
  });
});

app.post('/contacts', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Please fill out all fields.' });
  }

  const query = 'INSERT INTO contact_email (email) VALUES (?)';
  db.query(query, [email], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to submit message' });
    }
    res.status(200).json({ message: 'Message sent successfully!' });
  });
});

app.get('/contactsemail', (req, res) => {
  const sql = "SELECT * FROM contact_email";
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching Email:', err);
      return res.status(500).json({ message: "Error fetching Email." });
    }
    return res.status(200).json(data);
  });
});

{/* Dashboard Count */}
app.get('/dashboardCounts', (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM book) as books,
      (SELECT COUNT(*) FROM orders) as orders,
      (SELECT COUNT(*) FROM language) as language,
      (SELECT COUNT(*) FROM category) as category,
      (SELECT COUNT(*) FROM contact) as contact,
      (SELECT COUNT(*) FROM users) as users;
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error fetching counts:', err);
      return res.status(500).json({ message: "Error fetching counts." });
    }
    
    // 'data' is an array with a single object containing all counts
    return res.status(200).json(data[0]);  // Return the first (and only) row
  });
});




app.get('/books/:id', (req, res) => {
    const sql = "SELECT * FROM book WHERE ID = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.json("Error");
        return res.json(data[0]);
    });
 });

app.listen(8081, () => {
    console.log("Server running on port 8081");
});
