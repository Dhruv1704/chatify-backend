const mongoose = require('mongoose')
const {Schema} = mongoose;

const callLogSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    sender_name:{
        type: String,
        required:true
    },
    receiver_name:{
        type:String,
        required:true
    },
    type:{
        type: String,
        required: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
})

const CallLog = mongoose.model('call-log', callLogSchema);
module.exports = CallLog;
