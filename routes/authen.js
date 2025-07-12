const express = require('express')
const User = require("../models/User")
const router = express.Router()
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const callTokenGenerator = require('../middleware/callTokenGenerator')
const axios = require('axios');
const UserGoogle = require("../models/UserGoogle");

//router 1 : Create a user using post request "/api/authen/createuser"  no login
router.post('/createuser', callTokenGenerator, [
    body('email', 'Enter a valid email').isEmail(),  // validation : express-validator
    body('name', 'Name must be at least 3 characters').isLength({min: 3}),
    body('password', 'Password must be at least 3 characters').isLength({min: 5})
], async (req, res) => {
    //If there are errors, return Bad request and the errors.
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({type: "error", message: errors.array()});
    }
    try {
        // checks if the email already exits or not
        let user = await User.findOne({email: req.body.email})
        if (user) {
            return res.status(400).json({type: "error", message: "Sorry a user with this email already exists."})
        }

        // secures the password using salt and hash method
        const salt = await bcrypt.genSalt(10);
        let securePass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({   // User Schema
            name: req.body.name,  // request
            password: securePass,
            email: req.body.email
        })

        // generating room_id and room codes

        const roomData = {
            "name": user._id,
            "description": "This is a room for " + user.name,
            "template_id": process.env.TEMPLATE_ID
        };

        let room_id = null;

        try {
            const response = await axios.post('https://api.100ms.live/v2/rooms', roomData, {
                headers: {
                    'Authorization': `Bearer ${req.token}`
                }
            });
            room_id = response.data.id;
            try {
                const roomCode = {
                    "room_id": room_id
                }
                const response1 = await axios.post(`https://api.100ms.live/v2/room-codes/room/${room_id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${req.token}`
                    }
                });
                roomCode[response1.data.data[0].role] = response1.data.data[0].code;
                roomCode[response1.data.data[1].role] = response1.data.data[1].code;
                user.roomCode = roomCode;
                await user.save();
            } catch (error) {
                await User.findByIdAndDelete(user._id);
                return res.status(500).json({
                    type: "error",
                    message: 'Cannot get room code.'
                });
            }
        } catch (error) {
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({
                type: "error",
                message: 'Cannot get room id.'
            });
        }

        // sending webtoken of createUser data
        const data = {
            user: {
                id: user.id,
                google: false
            }
        }
        const webToken = jwt.sign(data, process.env.JWT_PASS);

        success = true
        res.json({
                type: "success",
                message: "User Created Successfully",
                webToken: webToken
            }
        )
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            type: "error",
            message: 'Some error occurred'
        })
    }
})
// router 2 : Authenticate a user using post request "/api/authen/login"  no login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    //If there are errors, return Bad request and the errors.
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({type: "error", message: errors.array()});
    }

    //Destructuring of email and password.
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({type: "error", message: "Please login with correct email/password."})
        }

        const passCheck = await bcrypt.compare(password, user.password)
        if (!passCheck) {
            return res.status(400).json({type: "error", message: "Please login with correct email/password."})
        }

        const data = {
            user: {
                id: user.id,
                google: false
            }
        }
        const webToken = jwt.sign(data, process.env.JWT_PASS);
        success = true;
        res.json({
            type: "success",
            message: `Welcome Back! ${user.name.split(" ")[0]}`,
            webToken,
            name: user.name,
            contact: user.contact
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            type: "error",
            message: 'Some error occurred'
        })
    }
})

router.post('/google/login', callTokenGenerator, async (req, res) => {
    const {googleAccessToken} = req.body;

    axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        })
        .then(async response => {
            const firstName = response.data.given_name;
            const lastName = response.data.family_name || "";
            const email = response.data.email;

            let user = await UserGoogle.findOne({email})

            if (!user) {
                user = await UserGoogle.create({
                    name: (firstName + " " + lastName).trim(),
                    email: email
                })
                const roomData = {
                    "name": user._id,
                    "description": "This is a room for " + user.name,
                    "template_id": process.env.TEMPLATE_ID
                };

                let room_id = null;

                try {
                    const response = await axios.post('https://api.100ms.live/v2/rooms', roomData, {
                        headers: {
                            'Authorization': `Bearer ${req.token}`
                        }
                    });
                    room_id = response.data.id;
                    try {
                        const roomCode = {
                            "room_id": room_id
                        }
                        const response1 = await axios.post(`https://api.100ms.live/v2/room-codes/room/${room_id}`, {}, {
                            headers: {
                                'Authorization': `Bearer ${req.token}`
                            }
                        });
                        roomCode[response1.data.data[0].role] = response1.data.data[0].code;
                        roomCode[response1.data.data[1].role] = response1.data.data[1].code;
                        user.roomCode = roomCode;
                        await user.save();
                    } catch (error) {
                        await UserGoogle.findByIdAndDelete(user._id);
                        return res.status(500).json({
                            type: "error",
                            message: 'Cannot get room code.'
                        });
                    }
                } catch (error) {
                    await UserGoogle.findByIdAndDelete(user._id);
                    return res.status(500).json({
                        type: "error",
                        message: 'Cannot get room id.'
                    });
                }
            }

            const data = {
                user: {
                    id: user.id,
                    google: true
                }
            }

            const webToken = jwt.sign(data, process.env.JWT_PASS);

            res.status(200).json({
                type: "success",
                message: `Welcome Back! ${user.name.split(" ")[0]}`,
                webToken,
                name: user.name,
                contact: user.contact
            })

        })
        .catch(err => {
            res.status(500).json({
                type: "error",
                message: 'Some error occurred'
            })
        })
})

module.exports = router;

// create user -> webToken -> login ->webToken -> getUser details -> webToken
