// import express from 'express';
// import nodemailer from 'nodemailer';
// import bodyParser from 'body-parser';
// import { dirname } from "path";
// import { fileURLToPath } from "url";
const express = require('express');
const path = require('path');
const nodemailer = require ('nodemailer');
const bodyParser = require ('body-parser');
const { dirname } = require ("path");
const { fileURLToPath } = require("url");
const PDFDocument = require("pdfkit")
const multer = require('multer');
const fs = require('fs');
const env = require('dotenv');

const exec = require('child_process').exec;
const {Client} = require("pg")


env.config();


const app = express();
const port = 3000;
const indexRouter = require('./routes/index');
// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));


// const __dirname = dirname(fileURLToPath(import.meta.url));




// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.) from the "public" directory
app.use(express.static('public'));

// Route to render the form
// app.get('/', (req, res) => {
//   res.render('email');
// });


//for the tracking start

// Middleware to handle JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files (index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Use the index router for the track route
app.use('/', indexRouter);




// PostgreSQL client setup
const client = new Client({
  connectionString: process.env.DATABASE_URL_INTERNAL,
});
client.connect();

// Replace this query with your actual table schema
const createTableQuery = `
CREATE TABLE IF NOT EXISTS Data (
    itemId SERIAL PRIMARY KEY,
    sendersname VARCHAR(255),
    sendersaddress VARCHAR(255),
    sendersphone VARCHAR(20),
    sendersemail VARCHAR(255),
    receiversname VARCHAR(255),
    receiversaddress VARCHAR(255),
    receiversphone VARCHAR(20),
    receiversemail VARCHAR(255),
    shipmentstatus VARCHAR(100),
    origin VARCHAR(255),
    packages VARCHAR(255),
    destination VARCHAR(255),
    currentlocation VARCHAR(255),
    carrier VARCHAR(100),
    typeofshipment VARCHAR(100),
    weight VARCHAR(255),
    shipmentmode VARCHAR(100),
    carrierreferenceno VARCHAR(255),
    product VARCHAR(255),
    qty VARCHAR(255),
    paymentmode VARCHAR(100),
    totalfreight VARCHAR(255),
    expecteddeliverydate VARCHAR(255),
    departuredate VARCHAR(255),
    deliverytime VARCHAR(255),
    packageimage VARCHAR(255)
);
`;

// Create the table if it doesn't exist
client.query(createTableQuery, (err, res) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created or already exists.');
  }
});












//for the tracking end


// Route to handle form submission and send email
app.post('/submit', (req, res) => {
  const { name, email, phone, message } = req.body;
  const subject = "Inquiry"
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user:process.env.EMAIL,
      pass:process.env.PASSWORD
    },
  });

  // Email options
  const mailOptions = {
    from: email, // Sender's email address
    to: process.env.EMAIL, // Recipient's email address
    subject: subject,
    phone: phone,
    text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email: ' + error.message);
    }
    // res.sendFile(path.join(__dirname, 'Tracking_ContactUs.html'));
    // res.sendFile(path.join(__dirname, 'view', 'succes.html'));
    res.send(('Email Sent Successfully'));
  });
});


//for update email
app.post('/update', (req, res) => {
  const { email } = req.body;
  const message = "I want to get latest updates and offers please keep me updated.";
  const subject = "Update Me"
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user:process.env.EMAIL,
      pass:process.env.PASSWORD
    },
  });

  // Email options
  const mailOptions = {
    from: email, // Sender's email address
    to: process.env.EMAIL, // Recipient's email address
    subject: subject,
    text: `Subject: ${subject}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email: ' + error.message);
    }
    // res.sendFile(path.join(__dirname, 'Tracking_ContactUs.html'));
    // res.sendFile(path.join(__dirname, 'view', 'succes.html'));
    res.send('Email sent successfully!');
  });
});









// app.use(bodyParser.json());

// app.post('/generate-pdf', (req, res) => {
//     const {
//         companyName, receiptType, createdDate, createdTime,
//         recipientName, recipientAddress, recipientEmail, recipientPhone,
//         parcelDescription, dispatchLocation, courierStatus,
//         dispatchDate, deliveryDate, carrier
//     } = req.body;

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');

//     doc.pipe(res);

//     // Add the text content to the PDF
//     doc.fontSize(20).text(companyName, { align: 'center' });
//     doc.fontSize(14).text(receiptType, { align: 'center', italic: true });
//     doc.moveDown();

//     doc.fontSize(12).text(`Created Date: ${createdDate}`, { align: 'left' });
//     doc.text(`Created Time: ${createdTime}`, { align: 'left' });
//     doc.moveDown();

//     doc.fontSize(12).text(`To: ${recipientName}`);
//     doc.text(recipientAddress);
//     doc.text(recipientEmail);
//     doc.text(recipientPhone);
//     doc.moveDown();

//     doc.fontSize(14).text('Shipment Details', { align: 'left', underline: true });
//     doc.moveDown();

//     doc.fontSize(12).text(`Parcel Description: ${parcelDescription}`);
//     doc.text(`Dispatch Location: ${dispatchLocation}`);
//     doc.text(`Courier Status: ${courierStatus}`);
//     doc.text(`Dispatch Date: ${dispatchDate}`);
//     doc.text(`Estimated Delivery Date: ${deliveryDate}`);
//     doc.text(`Carrier: ${carrier}`);

//     doc.end();
// });

// app.use(bodyParser.json({ limit: '10mb' })); // To handle large HTML content

// app.post('/generate-pdf', (req, res) => {
//     const { html } = req.body;

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

//     doc.pipe(res);

//     // Add the selected content to the PDF
//     doc.text(html, {
//         width: 410,
//         align: 'left'
//     });

//     doc.end();
// });


// Track item by ID and render with EJS
app.get('/track:itemId', (req, res) => {
  const trackingCode = req.params.itemId;

  const selectQuery = 'SELECT * FROM Data WHERE carrierreferenceno = $1';
  client.query(selectQuery, [trackingCode], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error reading data');
    }
    console.log(result)
    if (result.rows.length > 0) {
      res.render('index', {
        formData: result.rows[0],
        buttontext: '',
        map: '',
        height: '0',
        current: '',
        packimg: '',
        imgtext: ''
      });
    } else {
      return res.status(404).send('Item not found');
    }
  });
});


app.get('/download-pdf:itemId', (req, res) => {
  const itemId = req.params.itemId
  
  const url = `https://geotracking-5nmv.onrender.com/track${itemId}`;

  exec(`wkhtmltopdf ${url} Receipt.pdf`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Error generating PDF');
    }

    res.download(path.join(__dirname, 'Receipt.pdf'), 'Receipt.pdf');
  });
});







const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name to avoid duplicates
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single('image');

// Serve the HTML file
app.get('/admin', (req, res) => {

  res.sendFile(path.join(__dirname, 'loginform.html'));
  // res.sendFile(path.join(__dirname, 'form.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginform.html'));
})

app.post('/check',(req,res)=>{
  const username = req.body["username"];
 const email = req.body["email"];
 const password = req.body["password"];

 if(email === "michaelchineduchilaka@gmail.com" && password ==="michael@12"){
   res.sendFile(path.join(__dirname, 'form.html'));
 }else{
   res.send("YOU ARE NOT A QUALIFIED ADMIN")
 }
})



// Route to handle form submission and insert data into PostgreSQL
app.post('/insert', (req, res) => {
  const formData = {
    sendersname: req.body.sendersname,
    sendersaddress: req.body.sendersaddress,
    sendersphone: req.body.sendersphone,
    sendersemail: req.body.sendersemail,
    receiversname: req.body.receiversname,
    receiversaddress: req.body.receiversaddress,
    receiversphone: req.body.receiversphone,
    receiversemail: req.body.receiversemail,
    shipmentstatus: req.body.shipmentstatus,
    origin: req.body.origin,
    packages: req.body.packages,
    destination: req.body.destination,
    currentlocation: req.body.currentlocation,
    carrier: req.body.carrier,
    typeofshipment: req.body.typeofshipment,
    weight: req.body.weight,
    shipmentmode: req.body.shipmentmode,
    carrierreferenceno: req.body.carrierreferenceno,
    product: req.body.product,
    qty: req.body.qty,
    paymentmode: req.body.paymentmode,
    totalfreight: req.body.totalfreight,
    expecteddeliverydate: req.body.expecteddeliverydate,
    departuredate: req.body.departuredate,
    deliverytime: req.body.deliverytime,
    packageimage: req.body.packageimage
  };

  const insertQuery = `
    INSERT INTO Data (
      sendersname, sendersaddress, sendersphone, sendersemail,
      receiversname, receiversaddress, receiversphone, receiversemail,
      shipmentstatus, origin, packages, destination, currentlocation,
      carrier, typeofshipment, weight, shipmentmode, carrierreferenceno,
      product, qty, paymentmode, totalfreight, expecteddeliverydate,
      departuredate, deliverytime, packageimage
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
      $18, $19, $20, $21, $22, $23, $24, $25,$26
    )
  `;

  const values = Object.values(formData);

  client.query(insertQuery, values, (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Data Creation Failed');
    }
    res.send('Data Created Successfully');
  });
});





// app.get('/update/:itemId', (req, res) => {

//   const dataFilePath = path.join(__dirname, 'formData.json');
//   const itemId = req.params.itemId;
//   const updatedData = req.body;

//   fs.readFile(dataFilePath, 'utf8', (err, data) => {
//       if (err) {
//           console.error('Error reading data file:', err);
//           return res.status(500).send('Error reading data');
//       }

//     let formData = JSON.parse(data);

//       // Find the index of the item with the given itemId
//       const itemIndex = formData.findIndex(item => item.itemId === itemId);
//       if (itemIndex !== -1) {
//           // Update only the specified fields
//           formData[itemIndex] = { ...formData[itemIndex], ...updatedData };

//           // Write the updated data back to the JSON file
//           fs.writeFile(dataFilePath, JSON.stringify(formData, null, 2), (err) => {
//               if (err) {
//                   console.error('Error saving updated data:', err);
//                   return res.status(500).send('Error saving data');
//               }
//               res.send('Data updated successfully');
//           });
//       } else {
//           res.status(404).send('Item not found');
//       }
//   });
// })


// Update item by ID
app.patch('/update/:itemId', (req, res) => {
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


// const dataFilePath = './formData.json'; // Path to your JSON file







// DELETE: Delete item by carrier reference number
app.delete('/delete/:itemId', (req, res) => {
  const carrierreferenceno = req.params.itemId;
  console.log(carrierreferenceno)
  const deleteQuery = 'DELETE FROM Data WHERE carrierreferenceno = $1';

  client.query(deleteQuery, [carrierreferenceno], (err) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('Error deleting data');
    }
    res.send('Data deleted successfully');
  });
});
  




// // Route to remove an object by key-value pair
// app.delete('/delete/:itemId', (req, res) => {
//   const { key, value } = req.params.itemId;

//   // Load the JSON file
//   fs.readFile(dataFilePath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading data file:', err);
//         return res.status(500).send('Error reading data');
//     }

//       let jsonData = JSON.parse(data);

//       // Filter out objects that match the given key-value pair
//       const filteredData = jsonData.filter(obj => obj[key] !== value);

//       // Save the updated JSON file
//       fs.writeFile(dataFilePath, JSON.stringify(filteredData, null, 4), 'utf8', (err) => {
//           if (err) {
//               return res.status(500).send('Error writing to JSON file.');
//           }
//           res.send('Object(s) removed successfully!');
//       });
//   });
// });












// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});










