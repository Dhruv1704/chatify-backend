const mongoose = require('mongoose')
const {Schema} = mongoose;

const AiTextSchema = new Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    history:{
        type: Array,
        default: []
    }
})

const AiText = mongoose.model('ai-text', AiTextSchema);
module.exports = AiText;
