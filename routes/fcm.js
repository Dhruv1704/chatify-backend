const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const {getMessaging} = require('firebase-admin/messaging');
const User = require("../models/User")

router.post('/subscribe',fetchUser,async (req,res)=> {
    try {
        const {token} = req.body;
        if (!token) {
            return res.status(400).json({
                type: 'error',
                message: "Please provide a valid token/topic"
            })
        }
        const topic = req.user.id;
        try {
            getMessaging().subscribeToTopic(token, topic)
                .then((response) => {
                    console.log('Successfully subscribed to topic:', response);
                })
                .catch((error) => {
                    console.log('Error subscribing to topic:', error);
                });
        }catch (e){
            return res.status(500).json({
                type: 'error',
                message: "Sorry! Some error occurred, try again later."
            })
        }
        return res.status(200).json({
            type: 'success',
            message: 'Subscribed to FCM'
        })
    } catch (e) {
        return res.status(500).json({
            type: 'error',
            message: "Sorry! Some error occurred, try again later."
        })
    }
})

router.post('/unsubscribe',fetchUser,async (req,res)=> {
    try {
        const {token} = req.body;
        if (!token) {
            return res.status(400).json({
                type: 'error',
                message: "Please provide a valid token/topic"
            })
        }
        const topic = req.user.id;
        try {
            getMessaging().unsubscribeFromTopic(token, topic)
                .then((response) => {
                    console.log('Successfully unsubscribed to topic:', response);
                })
                .catch((error) => {
                    console.log('Error unsubscribing to topic:', error);
                });
        }catch (e) {
            return res.status(500).json({
                type: 'error',
                message: "Sorry! Some error occurred, try again later."
            })
        }
        return res.status(200).json({
            type: 'success',
            message: 'Unsubscribed to FCM'
        })
    } catch (e) {
        return res.status(500).json({
            type: 'error',
            message: "Sorry! Some error occurred, try again later."
        })
    }
})

router.put('/updateToken',fetchUser,async (req,res)=> {
    try {
        const {token} = req.body;
        if (!token) {
            return res.status(400).json({
                type: 'error',
                message: "Please provide a valid token"
            })
        }
        const user = await User.findById(req.user.id);
        user.token = token;
        await user.save();
        return res.status(200).json({
            type: 'success',
            message: 'Token Updated'
        })
    } catch (e) {
        return res.status(500).json({
            type: 'error',
            message: "Sorry! Some error occurred, try again later."
        })
    }
})
module.exports = router;

