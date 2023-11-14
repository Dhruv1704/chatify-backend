const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const {Hercai} = require('hercai');

router.post('/question',fetchUser,async (req, res) => {
    try {
        const {question} = req.body
        const herc = new Hercai();
        await herc.question({model: "v3-beta", content: question}).then(response => {
            if(response.reply === null){
                return res.status(400).json({
                    type: 'error'
                })
            }
            return res.status(200).json({
                type : 'success',
                message: response.reply
            })
        });
    }catch (e){
        return res.status(500).json({
            type: 'error'
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
