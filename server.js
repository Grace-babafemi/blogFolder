const express = require('express');
const connectDb = require('./Config/config');
const router = require('./Routes');
const app = express();
app.use(express.json());

require("dotenv/config")



const {PORT} = process.env

const port = PORT
connectDb()
app.use("/api", router)




app.listen(port,()=>{
    console.log(new Date().toLocaleDateString());
})