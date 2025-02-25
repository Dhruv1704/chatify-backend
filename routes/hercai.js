const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const {Hercai} = require('hercai');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AiText = require("../models/AiText")

router.get('/getAiChat', fetchUser, async (req, res)=>{
   try {
       const chats = await AiText.findOne({user_id:req.user.id})
       return res.status(200).json({
           type : 'success',
           aiChat: chats.history
       })
   }catch (e){
       console.log(e)
       return res.status(500).json({
           type: 'error',
           message: "Sorry! Some error occurred, try again later."
       })
   }
})

router.delete('/deleteAiChat', fetchUser, async (req, res)=>{
   try {
       await AiText.findOneAndDelete({user_id:req.user.id})
       return res.status(200).json({
           type : 'success'
       })
   }catch (e){
       console.log(e)
       return res.status(500).json({
           type: 'error',
           message: "Sorry! Some error occurred, try again later."
       })
   }
})

router.put('/question',fetchUser,async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const {history, question} = req.body
        const chat = model.startChat({
            history
        });

        let result = await chat.sendMessage(question);
        const message =
            {
                role: "model",
                parts: [{ text: result.response.text() }],
            }
        const dbHistory = await AiText.findOne({user_id: req.user.id} )
        if(dbHistory){
            dbHistory.history = history
            await dbHistory.save()
        }else{
            await AiText.create({
                user_id: req.user.id,
                history
            })
        }
        return res.status(200).json({
            type : 'success',
            message
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
        await herc.drawImage({model: "v3", prompt: image}).then(response => {
            if (response.url === null || response===undefined) {
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
