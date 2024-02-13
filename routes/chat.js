const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Chat = require('../models/Chat')
const {body, validationResult} = require("express-validator");
const {getMessaging} = require('firebase-admin/messaging');
const User = require("../models/User")

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
    body('type', 'Please enter a type').exists(),
    body('receiverName', 'Please enter the receiver name').exists(),
], async (req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({type: "error", message: errors.array()});
        }
        const { receiver, content, type, receiverName} = req.body;
        const message = {
            sender: req.user.id,
            receiver,
            content,
            type
        }
        await Chat.create(message);
        const topic = receiver;

        const messageFCM = {
            data: {
                title: receiverName,
                body: content,
                image: "https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/app-image%2Ficon_x512-modified.png?alt=media&token=3192bd5a-4a8b-4598-826f-cd8339c3ca0c",
                badge: "https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/app-image%2Ficon_x512-modified.png?alt=media&token=3192bd5a-4a8b-4598-826f-cd8339c3ca0c",
            },
            topic: topic
        };

        // Send a message to devices subscribed to the provided topic.
        getMessaging().send(messageFCM)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });

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
