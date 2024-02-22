const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const User = require("../models/User")
const {validationResult, body} = require("express-validator");
const UserGoogle = require("../models/UserGoogle");

// get details of user(name and email) and their contacts

router.get('/getContact',fetchUser, async (req,res)=>{
    try{
        let user;
        if(req.user.google){
            user = await UserGoogle.findById(req.user.id);
        } else{
            user = await User.findById(req.user.id);
        }
        if(!user){
            return res.status(404).json({
                type:"error",
                message:"User not found"
            })
        }
        return res.status(200).json({
            type: "success",
            contact : user.contact,
            email: user.email,
            name : user.name,
            id: req.user.id,
        })
    }catch (error) {
        return res.status(500).json({
            type: "error",
            message: 'Some error occurred'
        })
    }
})
router.post('/addContact',fetchUser,[
    body('contactId', 'Enter a valid token').exists()
],async (req, res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({type: "error", message: errors.array()});
        }
        const {contactId} = req.body;
        const newContact = await User.findById(contactId) || await UserGoogle.findById(contactId);
        if (!newContact) {
            return res.status(404).json({
                type: 'error',
                message: 'Contact does not exist.'
            })
        }
        if(newContact._id.toString() === req.user.id){
            return res.status(404).json({
                type:'error',
                message: 'This is your token.'
            })
        }
        const user = await User.findById(req.user.id) || await UserGoogle.findById(req.user.id);
        for(const contact of user.contact){
            if(contact.id === contactId){
                return res.status(200).json({
                    type: "error",
                    message: "Contact is already present"
                })
            }
        }
        const contact = {
            _id: newContact._id,
            name: newContact.name,
            email: newContact.email
        }
        user.contact.push(contact);
        await user.save();
        return res.status(200).json({
            type: "success",
            message: "Contact Added Successfully",
            contact : user.contact
        })
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: 'Some error occurred'
        })
    }
})

// Also delete the messages between them.
router.delete('/deleteContact/:id', fetchUser, async (req, res)=>{
    try{
        const user = await User.findById(req.user.id);
        const id = ObjectId(req.params.id);
        for(let i=0;i<user.contact.length;i++){
            if(user.contact[i]._id === id){
                user.contact.splice(i,1);
                return res.status(200).json({
                    type: "succes",
                    message: "Contact Deleted Successfully"
                })
            }
        }
        return res.status(200).json({
            type: "error",
            message: "Contact does not exist",
        })
    }catch (error){
        return res.status(500).json({
            type: "error",
            message: 'Some error occurred'
        })
    }
})

module.exports = router;
