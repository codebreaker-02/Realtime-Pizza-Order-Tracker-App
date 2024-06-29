// Import the express module
const express = require('express');
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')

// Create an instance of the express application
const app = express(); 

// Set the port number
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//set a template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');


// Define a route for the root URL
app.get('/', (req, res) => {
    res.render('home');
});

// Define a route for the register page
app.get('/register', (req, res) => {
    res.render('auth/register')
});

// Define a route for the login page
app.get('/login', (req, res) => {
    res.render('auth/login')
});

// Define a route for the cart page
app.get('/cart', (req, res) => {
    res.render('customers/cart')
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
