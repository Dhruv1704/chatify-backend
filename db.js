const mongoose = require('mongoose')
require('dotenv').config();

const monoURI = process.env.MONGO_URI;
mongoose.set('strictQuery', false);

const connectToMongo = async ()=>{
    await mongoose.connect(monoURI);

    if (mongoose.connection.readyState === 1) {
        console.log('Connected to MongoDB database');
    } else {
        console.log('Failed to connect to MongoDB database');
    }
}

module.exports = connectToMongo;
