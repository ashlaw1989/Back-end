// grab database
const db = require("../db")

// create model for schema
const User = db.model("User", {
    username:{type:String, required:true},
    password:{type:String, required:true},
    status: String
})

module.exports = User;