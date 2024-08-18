const Order = require('../../../models/order');

function statusController(){
    return{
        update(req, res) {
            //Here we are updating the particular order status
            Order.updateOne({ _id: req.body.orderId }, { status: req.body.status })
                .then(() => {
                    // Emit event
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status });
                    return res.redirect('/admin/orders');
                })
                .catch(err => {
                    console.error(err); // Log the error for debugging
                    return res.redirect('/admin/orders');
                });
        }        
    }
}

module.exports = statusController;