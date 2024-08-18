const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 

const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: Object,
        requires: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        default: 'COD'
    },
    status: {
        type: String,
        default: 'order_placed'
    }
    // here timestamps is used to store the time when the data is created or updated
}, { timestamps: true });

//Model is singular and collection is plural and it is automatically created by mongoose
module.exports = mongoose.model('Order', orderSchema);
