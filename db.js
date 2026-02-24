// connect to database
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://ashlaw89:Password123@songdb.cwmpquv.mongodb.net/?appName=SongDb")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connected successfully!"));

module.exports = mongoose;