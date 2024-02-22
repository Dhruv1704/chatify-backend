const mongoose = require('mongoose')
const {Schema} = mongoose;

const userGoogleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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

const UserGoogle = mongoose.model('user-google', userGoogleSchema);
module.exports = UserGoogle;
