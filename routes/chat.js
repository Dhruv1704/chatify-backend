const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Chat = require('../models/Chat')
const {body, validationResult} = require("express-validator");
const {getMessaging} = require('firebase-admin/messaging');
const User = require("../models/User")
const UserGoogle = require("../models/UserGoogle");

router.get('/getMessage', fetchUser, async (req,res)=>{
    try{
        const id = req.user.id;
        const chats = await Chat.find({
            $or: [
                { sender: id },
                { receiver: id }
            ],
            $and: [ // Include chats where:
                { $or: [ // Either:
                        { permaDelete: false }, // permaDelete is false
                        { permaDelete: true, InaccessibleBy: { $ne: id } } // OR permaDelete is true and InaccessibleBy is not equal to id
                    ]}
            ]
        });
        return res.status(200).json({
            type: "success",
            chats
        })
    }catch (e){
        console.log(e)
        return res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        })
    }
})

router.post('/addMessage', fetchUser, [
    body('message', 'Please enter a message').exists()
], async (req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({type: "error", message: errors.array()});
        }
        const { message} = req.body;
        const chat = await Chat.create(message);
        const receiverDoc = await User.findById(message.receiver) || await UserGoogle.findById(message.receiver);
        const sender = await User.findById(req.user.id) || await UserGoogle.findById(req.user.id);
        const token = receiverDoc.fcm_token;
        if (!receiverDoc.fcm_token) {
            return res.status(404).json({
                type: 'error',
                message: 'Receiver does not exist.'
            })
        }

        const senderName = sender.name;

        let fcmBody = message.content
        if(message.type!=="text"){
            fcmBody = message.type.charAt(0).toUpperCase() + message.type.slice(1);
        }

        const messageFCM = {
            data: {
                type:"message",
                title: senderName,
                body: fcmBody,
                image: "https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/app-image%2Ficon_x512-modified.png?alt=media&token=3192bd5a-4a8b-4598-826f-cd8339c3ca0c"
            },
            android: {
                notification: {
                    imageUrl: "https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/app-image%2Ficon_x512-modified.png?alt=media&token=3192bd5a-4a8b-4598-826f-cd8339c3ca0c"
                },
                "priority":"high"
            },
            apns: {
                headers:{
                    "apns-priority":"5"
                },
                payload: {
                    aps: {
                        'mutable-content': 1
                    }
                },
                fcm_options: {
                    image: "https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/app-image%2Ficon_x512-modified.png?alt=media&token=3192bd5a-4a8b-4598-826f-cd8339c3ca0c"
                }
            },
            webpush: {
                headers: {
                    image: "https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/app-image%2Ficon_x512-modified.png?alt=media&token=3192bd5a-4a8b-4598-826f-cd8339c3ca0c",
                    Urgency: "high"
                }
            },
            token:token
        };

        getMessaging()
            .send(messageFCM)
            .then((response) => {
                res.status(200).json({
                    message: "Successfully sent message",
                    chat
                });
                console.log("Successfully sent message:", response);
            })
            .catch((error) => {
                res.status(400);
                res.send(error);
                console.log("Error sending message:", error);
            });
    }catch (e){
        return res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        })
    }
})

//Also make for multiple messages.
router.delete('/deleteMessage', fetchUser, async (req, res)=>{
    try{
        const {chats} = req.body;
        chats.forEach(async (item)=> {
            const chat = await Chat.findById(item);
            if(chat.permaDelete) await Chat.findByIdAndDelete(item);
            else{
                chat.permaDelete = true;
                chat.InaccessibleBy = req.user.id;
                await chat.save();
            }
        })
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



// image: "https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/app-image%2Ficon_x512-modified.png?alt=media&token=3192bd5a-4a8b-4598-826f-cd8339c3ca0c",
//     badge: "https://firebasestorage.googleapis.com/v0/b/chatify-17.appspot.com/o/app-image%2Ficon_x512-modified.png?alt=media&token=3192bd5a-4a8b-4598-826f-cd8339c3ca0c",
