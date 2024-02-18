const connectToMongo = require("./db");
const express = require('express');
const cors = require('cors')
const admin = require("firebase-admin");

const serviceAccount = require("./chatify-17-firebase-adminsdk-o0uge-daec6a9290.json");
const jwt = require("jsonwebtoken");
const uuid4 = require("uuid4");

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
