const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');

function initRoutes(app){
    // Define a route for the root URL
    app.get('/', homeController().index);

    // Define a route for the register page
    app.get('/register', authController().register);

    // Define a route for the login page
    app.get('/login', authController().login);

    // Define a route for the cart page
    app.get('/cart', cartController().index);

    // Define a route for the update-cart page
    app.post('/update-cart', cartController().update);
}

module.exports = initRoutes;