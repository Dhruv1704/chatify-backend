const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Chat = require('../models/Chat')
const {body, validationResult} = require("express-validator");
const { Hercai } = require('hercai');


router.get('/getMessage', fetchUser, async (req,res)=>{
    try{
        const chats = await Chat.find({ $or: [{ sender: req.user.id }, { receiver: req.user.id }] })
        return res.status(200).json({
            type: "success",
            chats
        })
    }catch (e){
        return res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        })
    }
})

router.post('/addMessage', fetchUser, [
    body('receiver', 'Please enter a receiver').exists(),
    body('content', 'Please enter a message').exists(),
    body('type', 'Please enter a type').exists()
], async (req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({type: "error", message: errors.array()});
        }
        const { receiver, content, type} = req.body;
        const message = {
            sender: req.user.id,
            receiver,
            content,
            type
        }
        await Chat.create(message);
        return res.status(200).json({
            type: "success",
            message: "Chat Added Successfully"
        })
    }catch (e){
        return res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        })
    }
})

//Also make for multiple messages.
router.delete('/deleteMessage/:id', fetchUser, async (req, res)=>{
    try{
        const id = req.params.id;
        await Chat.findByIdAndDelete(id);
        return res.status(200).json({
            type: "success",
            message: "Chat Deleted Successfully"
        })
    }catch (e){
        return res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        })
    }
})


module.exports = router
