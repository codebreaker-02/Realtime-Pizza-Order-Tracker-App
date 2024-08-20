const express = require('express'); // Import the express module
const ejs = require('ejs') // Import the ejs module
const path = require('path') // Import the path module
const mongoose = require('mongoose') // Import the mongoose module
const expressLayout = require('express-ejs-layouts')
const session = require('express-session') // Import the express-session module
const dotenv = require('dotenv'); // Import the dotenv module
const flash = require('express-flash') // Import the express-flash module
// We always use capital with the variable if it consists a Class or a Constructor value in them
const MongoDbStore = require('connect-mongo') //Import the connect-mongo module
const passport = require('passport')
const Emitter = require('events')

const app = express(); // Create an instance of the express application
const PORT = process.env.PORT || 3000; // Set the port number

dotenv.config(); // Configure the dotenv module

const conn = async () => {
    try {
        await mongoose
            .connect(process.env.MONGO_CONNECTION_URL)
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
let mongoStore = MongoDbStore.create({ mongoUrl: process.env.MONGO_CONNECTION_URL})

//Event Emitter 
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

//Session config 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    //if there is no store key, then it will by deafult store in memory
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hours
}))

//Passport config

//We have created a seperate config file because it is large and we want to keep our server.js file clean
const passportInit = require('./app/config/passport');

passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())


app.use(flash());

//Assets
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
//Parse json data
app.use(express.json());
//Some times we recieve data from the 'form' as urlencoded data also so we have to add that middleware also
app.use(express.urlencoded({ extended: false }));


conn();

//Global middleware
app.use((req, res, next)=>{
    res.locals.session = req.session;
    res.locals.user = req.user;
    next()
})

//set a template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');

//Routes from '/routes/web.js'
require('./routes/web')(app);

app.use((req, res) => {
    res.status(404).render('errors/404');
})
// Start the server and listen on the specified port
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//socket

const io = require('socket.io')(server)

io.on('connection', (socket) => {
    //Join 
    // Here we have to create private rooms for individual orders because they are going to change the status of the order in real-time
    //So the next task was to select a name for the room, so we can use the order id as the name of the room because it is unique and also it can be used to identify the order
    socket.on('join', (orderId) => {
        socket.join(orderId);
    })  
})

//This is for the user order, whenever a request from backend comes for updating the client side it helps by sending an update event to user
eventEmitter.on('orderUpdated', (data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated', data);
})

eventEmitter.on('orderPlaced', (data)=>{
    io.to('adminRoom').emit('orderPlaced', data);
})