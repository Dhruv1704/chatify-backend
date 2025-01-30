const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const {Hercai} = require('hercai');
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/question',fetchUser,async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const {question} = req.body
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Hello" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Great to meet you. What would you like to know?" }],
                },
            ],
        });

        let result = await chat.sendMessage(question);
        console.log(result.response.text());
        return res.status(200).json({
            type : 'success',
            message: result.response.text()
        })
    }catch (e){
        console.log(e)
        return res.status(500).json({
            type: 'error',
            message: "Sorry! Some error occurred, try again later."
        })
    }
})

router.post('/drawImage',fetchUser, async (req, res) => {
    try {
        const {image} = req.body;
        const herc = new Hercai();
        await herc.drawImage({model: "lexica", prompt: image}).then(response => {
            if (response.url === null) {
                return res.status(400).json({
                    type: 'error'
                })
            }
            return res.status(200).json({
                type: "success",
                url: response.url
            })
        });
    } catch (e) {
        return res.status(500).json({
            type: 'error'
        })
    }
})


module.exports = router
