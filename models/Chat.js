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
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;
