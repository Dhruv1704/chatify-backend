const connectToMongo = require("./db");
const express = require('express');
const cors = require('cors')

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
