const order = require("../../../models/order")

const moment = require('moment');

function orderController(){
    return{
        async index(req, res){
            //Here the $ne means not equal to
            //and we have done some filtering to show orders in descending order
            //populate is used because we want to show the customer details as well
            //because the customerId is stored in the order model
            //and we want to fetch the customer details from the customer model
            try {
                const orders = await order.find({ status: { $ne: 'completed' } })
                    .sort({ createdAt: -1 })
                    .populate('customerId', '-password')
                    .exec();
                
                //What is the need of populate method?
                //=> To get the full customer details (including the name), you need to use the populate method. This method replaces the customerId reference in the order object with the actual customer document (excluding sensitive fields like the password, if specified).
                //  And that -password is used to exclude the password field from the customer details
                if (req.xhr) {
                    return res.json(orders);
                } else {
                    return res.render('admin/orders', { orders });
                }
            } catch (err) {
                console.error(err);
                return res.status(500).json({ message: 'An error occurred' });
            }            
        }
    }
}

module.exports = orderController;