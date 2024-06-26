const mongoose = require('mongoose')
const {Schema} = mongoose;

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
    contact: {
        type:Array,
        default: []
    },
    fcm_token:{
        type: String,
        default: null
    },
    roomCode: {
        type: Object,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
