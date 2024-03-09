const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const User = require("../models/User")
const UserGoogle = require("../models/UserGoogle");
const CallLogs = require("../models/CallLogs");
const {getMessaging} = require("firebase-admin/messaging");

router.post('/',  fetchUser, async (req, res) => {
    try{
        const {roomCode, type, receiver} = req.body;
        const callLog = await CallLogs.create({
            type,
            receiver,
            sender: req.user.id
        })
        const receiverDoc = await User.findById(receiver) || await UserGoogle.findById(receiver);
        const sender = await User.findById(req.user.id) || await UserGoogle.findById(req.user.id);
        const token = receiverDoc.fcm_token;
        if (!receiverDoc.fcm_token) {
            return res.status(404).json({
                type: 'error',
                message: 'Receiver does not exist.'
            })
        }

        const messageFCM = {
            data: {
                type: type,
                title: sender.name,
                body: roomCode,
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
                    message: "Successfully added callLog"
                });
            })
            .catch((error) => {
                res.status(400);
                res.send(error);
                console.log("Error sending message:", error);
            });
    }catch (e) {
        res.json({
            type: "error",
            message: "Some error occurred"
        })
    }
})

router.get('/callLogs', fetchUser, async (req, res)=>{
    try{
        const callLogs = await CallLogs.find({
            $or:[
                {sender: req.user.id},
                {receiver: req.user.id}
            ]
        }).sort({ timeStamp: -1 }).limit(15);
        res.json({
            type:"success",
            callLogs
        })
    }catch (e){
        res.json({
            type: "error",
            message: "Some error occurred"
        })
    }
})

module.exports = router;
