const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');
const guest = require('../app/http/middleware/guest');

function initRoutes(app){
    // Define a route for the root URL
    app.get('/', homeController().index);

    // Define a route for the register page
    app.get('/register', guest, authController().register);

    // Define a route for the post-register page ( here we are naming this different because we cannot use same method name in a controller, also this is a post request)
    app.post('/register', authController().postRegister);

    // Define a route for the login page
    app.get('/login', guest, authController().login);

    // Define a route for the post-login page
    app.post('/login', authController().postLogin);

    // Define a route for the cart page
    app.get('/cart', cartController().index);

    // Define a route for the update-cart page
    app.post('/update-cart', cartController().update);

    // Define a route for the logout page
    app.post('/logout', authController().logout);
}

module.exports = initRoutes;