// setup
const express = require("express")
// use cors to host front and back end on same device
var cors = require("cors")

const bodyParser = require("body-parser")
const Song = require("./models/songs")
const app = express()
app.use(cors())
const jwt = require("jwt-simple")
const User = require("./models/users")

app.use(bodyParser.json())
const router = express.Router()
const secret = "supersecret"

// create new user
router.post("/user", async (req, res) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({error: "Missing username or password"})
    }

    const newUser = await new User ({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })

    try {
        await newUser.save()
        console.log(newUser)
        res.status(201).json(newUser) // created
    }
    catch(err) {
        res.status(400).send(err)
    }
})

// authenticate/login
// post request - when you login, you are creating a new session
router.post("/auth", async(req, res) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({error: "Missing username or password"})
        return 
    }
    // try to find username - see if it matches username & password
    // await finding a user
    let user = await User.findOne({username : req.body.username})
        // connection or server error

        // if they can't find user
    if(!user){
            res.status(401).json({error: "Bad username"})
        }
        // check password
        else {
            if(user.password != req.body.password) {
                res.status(401).json({error: "Bad password"})
            }
            // login successful
            else {
                // create token encoded w/ jwt library & send back username
                // also send back as part of token that you are currently authorized - can do w/ boolean or # value
                // ex. if auth = 0 you are not authorized, auth = 1, you are authorized

                username2 = user.username
                const token = jwt.encode({username: user.username}, secret)
                const auth = 1

                // respond w/ token
                res.json({
                    username2,
                    token: token,
                    auth: auth
                })
            }
        }
    })

// check status of user with a valid token see if it matches the front end token
router.get("/status", async(req, res) => {
    if(!req.headers["x-auth"]){
        return res.status(401).json({error: "Missing X-Auth"})
    }

    // if x-auth contains the token (it should)
    const token = req.headers["x-auth"]
    try {
        const decoded = jwt.decode(token, secret)
        // send back all username and status fields to user or front-end
        let users = User.find({}, "username status")
        res.json(users)
    }
})


// grab all songs in a database
router.get("/songs", async(req, res) => {
    try {
        const songs = await Song.find({})
        res.send(songs)
        console.log(songs)
    }
    catch (err) {
        console.log(err)
        res.status(400).send(err)
    }

})

// grab a single song in db
router.get("/songs/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id)
        res.json(song)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

// add songs to database
router.post("/songs", async(req, res) => {
    try {
        const song = await new Song(req.body)
        await song.save()
        res.status(201).json(song)
        console.log(song)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

// update existing record/resource/db entry.. uses put request
router.put("/:id", async(req, res) => {
    //first find and update song the front end wants us to update
    // we need to request id of song from request
    //find it in dtabase and update it
    try {
        const song = req.body
        await Song.updateOne({ _id: req.params.id }, req.body)
        console.log(song)
        res.sendStatus(204)
    }
    catch(err) {
        res.status(400).send(err)  
    }
})

router.delete("/songs/:id", async(req, res) => {
    // method or function in mongoogse/mongo to delete a single instance of song or object
    try {
        const song = await Song.findById(req.params.id)
        console.log(song)
        await Song.deleteOne({_id: req.params.id})
        res.sendStatus(204)
    }
    catch(err) {
        res.status(400).send(err)
    }
})

app.use("/api", router);
app.listen(3000);
// url: http://localhost:3000/api/songs