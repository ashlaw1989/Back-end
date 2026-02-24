// setup
const express = require("express")
// use cors to host front and back end on same device
var cors = require("cors")

const bodyParser = require("body-parser")
const Song = require("./models/songs")
const app = express()
app.use(cors())

app.use(bodyParser.json())
const router = express.Router()

// grab all songs in a database
router.get("/songs", async(req, res) => {
    try {
        const songs = await Song.find({})
        res.send(songs)
        console.log(songs)
    }
    catch (err) {
        console.log(err)
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
        await Song.updateOne({_id: req.params.id}, song)
        console.log(song)
        res.sendStatus(204)
    }
    catch(err) {
        res.status(400).send(err)  
    }
})

app.use("/api", router);
app.listen(3000);
// url: http://localhost:3000/api/songs