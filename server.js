const express = require('express'); // Import the express module
const ejs = require('ejs') // Import the ejs module
const path = require('path') // Import the path module
const mongoose = require('mongoose') // Import the mongoose module
const expressLayout = require('express-ejs-layouts')
const app = express(); // Create an instance of the express application
const PORT = process.env.PORT || 3000; // Set the port number
const session = require('express-session') // Import the express-session module
const dotenv = require('dotenv'); // Import the dotenv module
const flash = require('express-flash') // Import the express-flash module
// We always use capital with the variable if it consists a Class or a Constructor value in them
const MongoDbStore = require('connect-mongo') //Import the connect-mongo module

dotenv.config(); // Configure the dotenv module

//Database connection -- local connection
const url = 'mongodb://127.0.0.1:27017/pizza';

const conn = async () => {
    try {
        await mongoose
            .connect(url)
            .then(() => {
                console.log("Database Connected....");
            });
    }
    catch (error) {
        console.log("Connection Failed", error);
    }
};
//Session Store
//It will use our default connection(conn defined above) and creates a collection named sessions
let mongoStore = MongoDbStore.create({ mongoUrl: url })

//Session config 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    //if there is no store key, then it will by deafult store in memory
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hours
}))

app.use(flash());

app.use(express.json());

conn();
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//Global middleware
app.use((req, res, next)=>{
    res.locals.session = req.session;
    next()
})

//set a template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');

//Routes from '/routes/web.js'
require('./routes/web')(app);

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
