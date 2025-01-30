const connectToMongo = require("./db");
const express = require('express');
const cors = require('cors')
const admin = require("firebase-admin");

const serviceAccount = require("./chatify-17-firebase-adminsdk-o0uge-a3517e4ee3.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

connectToMongo()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.json("server start")
})

app.use('/api/authen', require('./routes/authen'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/chat', require('./routes/chat'))
app.use('/api/ai', require('./routes/hercai'))
app.use('/api/fcm', require('./routes/fcm'))
app.use('/api/call', require('./routes/call'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
