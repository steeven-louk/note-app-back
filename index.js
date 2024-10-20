const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/Auth");
const bodyParser = require("body-parser");
// const db = require("mongoose");
const app =express();
const connectToMongoDB = require("./db/db")
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.json());

app.use(cors());
app.use('/api/auth', authRouter)

// db.connect(process.env.MONGO_URL).then(console.log('base de donner connecté')).catch((err) => console.log('error: ', err))

const port = process.env.PORT || 5500;




app.listen(port,()=>{
    connectToMongoDB()
    console.log("Server is running", port)
})