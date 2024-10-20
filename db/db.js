const mongoose = require("mongoose")

const connectToMongoDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=> console.log("Connected to MongoDB"));
    } catch (error) {
        console.log(error.message, "Error connecting to DB")
    }
}

module.exports = connectToMongoDB
