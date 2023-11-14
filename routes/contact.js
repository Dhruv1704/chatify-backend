const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const User = require("../models/User")
const {validationResult, body} = require("express-validator");

// get details of user(name and email) and their contacts

router.get('/getContact',fetchUser, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id);
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
    body('contactEmail', 'Enter a valid email').isEmail()
],async (req, res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({type: "error", message: errors.array()});
        }
        const {contactEmail} = req.body;
        const newContact = await User.findOne({email: contactEmail});
        if (!newContact) {
            return res.status(404).json({
                type: 'error',
                message: 'Contact does not exist.'
            })
        }
        if(newContact._id.toString() === req.user.id){
            return res.status(404).json({
                type:'error',
                message: 'This is your email.'
            })
        }
        const user = await User.findById(req.user.id)
        for(const contact of user.contact){
            if(contact.email === contactEmail){
                return res.status(200).json({
                    type: "error",
                    message: "Contact is already present"
                })
            }
        }
        user.contact.push(newContact);
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
