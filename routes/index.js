const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
// const puppeteer = require('puppeteer');
const ejs = require('ejs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const env = require('dotenv');


// // Create a connection to the database
// const db = mysql.createConnection({
//     host: 'localhost',       // Hostname of the MySQL server
//     user: 'root',            // MySQL user
//     password: '',            // MySQL user's password (usually empty for XAMPP)
//     database: 'todo'       // Database name
//   });
  
//   db.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL:');
//       return;
//     }
//     console.log('Connected to MySQL');
//   });

env.config();




// PostgreSQL client setup
const client = new Client({
    connectionString: process.env.DATABASE_URL_INTERNAL,
  });
  
  client.connect();

// Route to handle the form submission

// router.post('/track', (req, res) => {
//   const { trackingCode } = req.body;
//   const dataFilePath = path.join(__dirname, '..', 'formData.json');

//   fs.readFile(dataFilePath, 'utf8', (err, data) => {
//       if (err) {
//           console.error('Error reading data file:', err);
//           return res.status(500).send('Error reading data');
//       }

//       let formData;
//       try {
//           formData = JSON.parse(data);
//       } catch (parseErr) {
//           console.error('Error parsing data:', parseErr);
//           return res.status(500).send('Error parsing data');
//       }

//       // Search for the item with the matching carrierreferenceno
//       const foundItem = formData.find(item => item.carrierreferenceno === trackingCode);

//       if (foundItem) {
//           // Render the EJS template with the found item
//           res.render('index', { formData: foundItem , buttontext:"Download Receipt" , map:foundItem.currentlocation ,height:"450" ,current:'Current Location' , imgtext:'Package Image' ,packimg:foundItem.packageimage});
//       } else {
//           return res.status(404).send('Item not found');
//       }
//   });
// });






// Track item by ID and render with EJS
router.post('/track', (req, res) => {
    const trackingCode = req.body['trackingCode'];
  
    const selectQuery = 'SELECT * FROM Data WHERE carrierreferenceno = $1';
    client.query(selectQuery, [trackingCode], (err, result) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).send('Error reading data');
      }
  
      if (result.rows.length > 0) {
        res.render('index', {
          formData: result.rows[0] , buttontext:"Download Receipt" , map:result.rows[0].currentlocation ,height:"450" ,current:'Current Location' , imgtext:'Package Image' ,packimg:result.rows[0].packageimage});
      } else {
        return res.status(404).send('Item not found');
      }
    });
  });
  

















// Update item by ID
router.patch('/update/:itemId', (req, res) => {
  const itemId = req.params.itemId;
  const updatedData = req.body;

  // Create an array to hold the columns and another for the values
  const columns = [];
  const values = [];

  let paramIndex = 1;

  // Loop through the keys in updatedData and build the query dynamically
  for (const key in updatedData) {
    if (updatedData[key] !== undefined && updatedData[key] !== '') {
      columns.push(`${key} = $${paramIndex}`);
      values.push(updatedData[key]);
      paramIndex++;
    }
  }

  if (columns.length === 0) {
    return res.status(400).send('No valid fields provided for update');
  }

  // Add the itemId to the values array
  values.push(itemId);

  // Construct the final query
  const updateQuery = `
    UPDATE Data
    SET ${columns.join(', ')}
    WHERE carrierreferenceno = $${paramIndex}
  `;

  // Execute the query
  client.query(updateQuery, values, (err) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).send('Error updating data');
    }
    res.send('Data updated successfully');
  });
});


// DELETE: Delete item by carrier reference number
router.delete('/delete/:itemId', (req, res) => {
  const carrierreferenceno = req.params.itemId;

  const deleteQuery = 'DELETE FROM Data WHERE carrierreferenceno = $1';

  client.query(deleteQuery, [carrierreferenceno], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('Error deleting data');
    }
    res.send('Data deleted successfully');
  });
});
  


// // Route to generate and download the PDF
// router.get('/download-pdf', async (req, res) => {
//   try {

   
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();

//       // // Render the EJS file to HTML
//       const html = (__dirname, 'view', 'index.ejs');

//       // Set the content to the page
//       await page.setContent(html);

//       // Generate the PDF
//       const pdf = await page.pdf({ format: 'A4' });

//       await browser.close();

//       // Send the PDF to the client
//       res.contentType("application/pdf");
//       res.send(pdf);
//   } catch (error) {
//       console.error('Error generating PDF:', error);
//       res.status(500).send('Error generating PDF');
//   }
// });



module.exports = router;
