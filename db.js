const mongoose = require("mongoose");
const url = "mongodb+srv://quatlas:quatlas123@cluster02.qch4w.mongodb.net/msritpp";

const connection = () => {
    mongoose.connect(url).then(() => {
        console.log("successfully connected to database");
    });
}

module.exports = connection;