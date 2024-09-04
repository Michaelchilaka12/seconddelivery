const express = require('express');
const path = require('path');
const pg = require('pg');
const multer = require('multer');
const env = require('dotenv');

const app = express();
const { query } = require('./db'); // Import the query function from db.js
const pool = require('./db');

const port = process.env.PORT || 3000;

env.config();

// Middleware to parse form data and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // PostgreSQL connection pool
// const db = new pg.Client({
//     user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     password: process.env.PG_PASSWORD,
//     port: process.env.PG_PORT,
// });

// db.connect();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder where images will be saved
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name to avoid duplicates
    }
});

const upload = multer({ storage: storage });

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the uploads folder
app.use('/uploads', express.static('uploads'));

// // Insert Data (POST) with Image Upload
// app.post('/items', upload.single('packageimage'), async (req, res) => {
//     const {
//         sendersname, sendersaddress, sendersphone, sendersemail, receiversname,
//         receiversaddress, receiversphone, receiversemail, shipmentstatus, origin,
//         packages, destination, carrier, typeofshipment, weight, shipmentmode,
//         carrierreferenceno, product, qty, paymentmode, totalfreight,
//         expecteddeliverydate, departuredate, deliverytime
//     } = req.body;

//     const packageimage = `${req.file.filename}`;

//     try {
//         const query = `INSERT INTO deliver (
//             sendersname, sendersaddress, sendersphone, sendersemail, receiversname,
//             receiversaddress, receiversphone, receiversemail, shipmentstatus, origin,
//             package, destination, carrier, typeofshipment, weight, shipmentmode,
//             carrierreferenceno, product, qty, paymentmode, totalfreight,
//             expecteddeliverydate, departuredate, deliverytime, packageimage
//         ) VALUES (
//             $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
//             $17, $18, $19, $20, $21, $22, $23, $24, $25
//         ) RETURNING *`;

//         const result = await db.query(query, [
//             sendersname, sendersaddress, sendersphone, sendersemail, receiversname,
//             receiversaddress, receiversphone, receiversemail, shipmentstatus, origin,
//             packages, destination, carrier, typeofshipment, weight, shipmentmode,
//             carrierreferenceno, product, qty, paymentmode, totalfreight,
//             expecteddeliverydate, departuredate, deliverytime, packageimage
//         ]);

//         res.status(201).json({ message: 'Item created successfully', item: result.rows[0] });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

// // Update Data (PATCH) with Image Upload
// app.patch('/items/:id', upload.single('packageimage'), async (req, res) => {
//     const { id } = req.params;
//     const {
//         sendersname, sendersaddress, sendersphone, sendersemail, receiversname,
//         receiversaddress, receiversphone, receiversemail, shipmentstatus, origin,
//         packages, destination, carrier, typeofshipment, weight, shipmentmode,
//         carrierreferenceno, product, qty, paymentmode, totalfreight,
//         expecteddeliverydate, departuredate, deliverytime
//     } = req.body;

//     const packageimage = req.file ? `/uploads/${req.file.filename}` : req.body.packageimage;

//     try {
//         const result = await db.query(
//             `UPDATE deliver SET
//             sendersname = $1, sendersaddress = $2, sendersphone = $3, sendersemail = $4, receiversname = $5,
//             receiversaddress = $6, receiversphone = $7, receiversemail = $8, shipmentstatus = $9, origin = $10,
//             package = $11, destination = $12, carrier = $13, typeofshipment = $14, weight = $15, shipmentmode = $16,
//             carrierreferenceno = $17, product = $18, qty = $19, paymentmode = $20, totalfreight = $21,
//             expecteddeliverydate = $22, departuredate = $23, deliverytime = $24, packageimage = $25
//             WHERE id = $26 RETURNING *`,
//             [
//                 sendersname, sendersaddress, sendersphone, sendersemail, receiversname,
//                 receiversaddress, receiversphone, receiversemail, shipmentstatus, origin,
//                 packages, destination, carrier, typeofshipment, weight, shipmentmode,
//                 carrierreferenceno, product, qty, paymentmode, totalfreight,
//                 expecteddeliverydate, departuredate, deliverytime, packageimage, id
//             ]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).send('Item not found');
//         }

//         res.status(200).json({ message: 'Item updated successfully', item: result.rows[0] });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });

// // Delete Data (DELETE)
// app.delete('/items/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await db.query('DELETE FROM deliver WHERE id = $1 RETURNING *', [id]);
//         if (result.rows.length === 0) {
//             return res.status(404).send('Item not found');
//         }
//         res.status(200).json({ message: 'Item deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server Error');
//     }
// });


// Example route to fetch data
app.get('/data', async (req, res) => {
    
    const createTableQuery = ('CREATE TABLE IF NOT EXISTs delivery( id INTEGER PRIMARY KEY, sendersname VARCHAR(255) NOT NULL, sendersaddress VARCHAR(255) NOT NULL, sendersphone VARCHAR(255) NOT NULL, sendersemail VARCHAR(255) NOT NULL, receiversname VARCHAR(255) NOT NULL, receiversaddress VARCHAR(255) NOT NULL, receiversphone VARCHAR(255) NOT NULL, receiversemail VARCHAR(255) NOT NULL, shipmentstatus VARCHAR(255) NOT NULL, origin VARCHAR(255) NOT NULL,packages VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, carrier VARCHAR(255) NOT NULL, typeofshipment VARCHAR(255) NOT NULL, weight VARCHAR(255) NOT NULL, shipmentmode VARCHAR(255) NOT NULL,carrierreferenceno VARCHAR(255) NOT NULL, product VARCHAR(255) NOT NULL, qty INTEGER NOT NULL, paymentmode VARCHAR(255) NOT NULL, totalfreight INTEGER NOT NULL,expecteddeliverydate DATE NOT NULL, departuredate DATE NOT NULL, deliverytime TIME NOT NULL, packageimage  VARCHAR(255) NOT NULL)');
        
    try {
        await pool.query(createTableQuery);
        res.send('Table created successfully.');
    } catch (err) {
        console.error('Error creating table:', err.stack);
        res.status(500).send('Error creating table.');
    }
      
});
  


  





// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});




