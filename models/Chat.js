const mongoose = require('mongoose')
const {Schema} = mongoose;

const chatSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    content: {
        type: String,
        required: true
    },
    type: {
      type: String,
      required: true
    },
    permaDelete:{
        type: Boolean,
        default: false,
        required: false
    },
    InaccessibleBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;
