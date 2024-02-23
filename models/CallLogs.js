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
    type:{
        type: String,
        required: true
    },
    timeStamp:{
        type: Date,
        default: Date.now
    }
})

const CallLog = mongoose.model('call-log', callLogSchema);
module.exports = CallLog;