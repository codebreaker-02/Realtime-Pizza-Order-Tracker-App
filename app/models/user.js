const mongoose = require('mongoose');   

const Schema = mongoose.Schema; 

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'customer'
    }
    // here timestamps is used to store the time when the data is created or updated
}, { timestamps: true });

//Model is singular and collection is plural and it is automatically created by mongoose
module.exports = mongoose.model('User', userSchema);
