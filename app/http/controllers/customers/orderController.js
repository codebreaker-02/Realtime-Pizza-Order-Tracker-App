const Order = require('../../../models/order');

//Very important : We have to use moment on the frontend but we cannot directly require it in our frontend files. So we have to pass it from the backend to the frontend from the controller using the render parameter
const moment = require('moment');

function orderController(){
    return{
        store(req, res){
            //Validate request
            const { phone, address } = req.body;

            if(!phone || !address){
                req.flash('All fields are required');   
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            });

            order.save().then(async result => {
                try {
                    // Populate customer details
                    const populatedOrder = await Order.findById(result._id).populate('customerId', '-password');
            
                    // Emit the event here to update the admin panel in real-time
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced', populatedOrder);
            
                    // If everything is successful, delete the cart and flash success message
                    delete req.session.cart;
                    req.flash('success', 'Order placed successfully');
                    
                    return res.redirect('/customer/orders');
                } catch (err) {
                    console.error(err); // Log the error for debugging
                    req.flash('error', 'Something went wrong while placing the order');
                    // Stay on the same page and show the flash message
                    return res.status(500).render('customers/cart'); // Render the same page (replace 'cart' with your actual view name)
                }
            }).catch(err => {
                req.flash('error', 'Something went wrong while placing the order');
                return res.status(500).render('customers/cart');
            });            
        },
        async index(req, res){
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
            res.render('customers/orders', { orders: orders, moment: moment });
        },
        show(req, res){
            Order.findById(req.params.id)
            .then(order => {
                // Authorize user
                if (order && req.user._id.toString() === order.customerId.toString()) {
                    return res.render('customers/singleOrder', { order: order });
                }
                // Redirect if the user is not authorized
                return res.redirect('/');
            })
            .catch(err => {
                // Handle errors such as invalid ID or database issues
                console.error(err);
                return res.redirect('/');
            });
        }
    }
}

module.exports = orderController;
