const { connect } = require("mongoose");
require("dotenv/config")

const {MONGODB_URL} = process.env;

const connectDb = async () => {
    try {
        await
       connect(MONGODB_URL)
        console.log("Connected SUCCESSFULLY!")
    } catch (error) {
        console.log("Connection FAILED!")
    }
}

module.exports = connectDb;