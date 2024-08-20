const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');
const orderController = require('../app/http/controllers/customers/orderController');

const adminOrderController = require('../app/http/controllers/admin/orderController')
const adminStatusController = require('../app/http/controllers/admin/statusController')

const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const admin = require('../app/http/middleware/admin');

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


    //Customer Routes
    // Define a route for the orders page
    app.post('/orders', auth, orderController().store);
    // Define a route for the customer orders page
    app.get('/customer/orders', auth, orderController().index);
    // Define a route for the customer single-order page
    app.get('/customer/orders/:id', auth, orderController().show);


    //Admin Routes
    
    // Define a route for the admin orders page
    app.get('/admin/orders', admin, adminOrderController().index);
    
    // Define a route for the admin order status page
    app.post('/admin/order/status', admin, adminStatusController().update);
}

module.exports = initRoutes;