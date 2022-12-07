import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import {Melody, _makeid} from "./data";
import {hash, codec} from "sjcl"

// set up Mongo
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoUrl)
let db: Db
let melodies: Collection
let users: Collection

// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// HELPERS

async function _getMel(composerId: string, melodyId: string) {
    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()
    return mel[0]
}

function _determineStatus(composerId: string, melodyId: string, mel: any, component: string) {
    if (mel == null || mel[component] == null) {
        return {"status": 404, "result": {composerId, melodyId}}
    }
    return {"status": 200, "result": mel[component]}
}

////// APP ROUTES

//// GET ROUTES

// returns all melodies of a composer
app.get("/api/composer/:composerId", async (req, res) => {
  const id = req.params.composerId.toString()

  const db = client.db("test")
  const melodies = db.collection("melodies")
  const mels = await melodies.find({ composerId: id }).toArray()

  if (mels == null) {
    res.status(404).json({id})
    return
  }
  res.status(200).json(mels)
})

// gets a particular phrase structure
app.get("/api/composer/:composerId/melody/:melodyId/phrase-structure", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const mel = await _getMel(composerId, melodyId)
    let result = _determineStatus(composerId, melodyId, mel, "phraseStructure")
    res.status(result.status).json(result.result)
})

// gets a particular meter
app.get("/api/composer/:composerId/melody/:melodyId/meter", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const mel = await _getMel(composerId, melodyId)
    let result = _determineStatus(composerId, melodyId, mel, "meter")
    res.status(result.status).json(result.result)
})

// gets a particular hypermeter
app.get("/api/composer/:composerId/melody/:melodyId/hypermeter", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const mel = await _getMel(composerId, melodyId)
    let result = _determineStatus(composerId, melodyId, mel, "hypermeter")
    res.status(result.status).json(result.result)
})

// gets a particular middleground rhythm
app.get("/api/composer/:composerId/melody/:melodyId/mg-rhythm", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const mel = await _getMel(composerId, melodyId)
    let result = _determineStatus(composerId, melodyId, mel, "mgRhythm")
    res.status(result.status).json(result.result)
})

// gets a particular foreground rhythm
app.get("/api/composer/:composerId/melody/:melodyId/fg-rhythm", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const mel = await _getMel(composerId, melodyId)
    let result = _determineStatus(composerId, melodyId, mel, "fgRhythm")
    res.status(result.status).json(result.result)
})

// gets a particular harmony transition matrix
app.get("/api/composer/:composerId/melody/:melodyId/matrix", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const mel = await _getMel(composerId, melodyId)
    let result = _determineStatus(composerId, melodyId, mel, "transitionMatrix")
    res.status(result.status).json(result.result)
})

// gets a particular harmonic progression
app.get("/api/composer/:composerId/melody/:melodyId/harmonicProgression", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const mel = await _getMel(composerId, melodyId)
    let result = _determineStatus(composerId, melodyId, mel, "harmonicProgression")
    res.status(result.status).json(result.result)
})

// gets a particular middleground melody
app.get("/api/composer/:composerId/melody/:melodyId/middleground-melody", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const mel = await _getMel(composerId, melodyId)
    let result = _determineStatus(composerId, melodyId, mel, "mgMelody")
    res.status(result.status).json(result.result)
})

//// PUT ROUTES

// puts a particular hypermeter
app.put("/api/composer/:composerId/melody/:melodyId/hypermeter", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const result = melodies.updateOne(
        {
            composerId: composerId,
            melodyId: melodyId
        },
        {
            $set: {
                hypermeter: req.body.hypermeter
            }
        },
        {
            upsert: true
        }
    )
    res.status(200).json({status:"ok"})
})

// puts a particular meter
app.put("/api/composer/:composerId/melody/:melodyId/meter", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const result = melodies.updateOne(
        {
            composerId: composerId,
            melodyId: melodyId
        },
        {
            $set: {
                meter: req.body.meter
            }
        },
        {
            upsert: true
        }
    )
    res.status(200).json({status:"ok"})
})

// puts a particular middleground rhythm
app.put("/api/composer/:composerId/melody/:melodyId/mg-rhythm", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const result = melodies.updateOne(
        {
            composerId: composerId,
            melodyId: melodyId
        },
        {
            $set: {
                mgRhythm: req.body.mgRhythm
            }
        },
        {
            upsert: true
        }
    )
    res.status(200).json({status:"ok"})
})

// puts a particular foreground rhythm
app.put("/api/composer/:composerId/melody/:melodyId/fg-rhythm", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const result = melodies.updateOne(
        {
            composerId: composerId,
            melodyId: melodyId
        },
        {
            $set: {
                fgRhythm: req.body.fgRhythm
            }
        },
        {
            upsert: true
        }
    )
    res.status(200).json({status:"ok"})
})

// puts a particular harmonic transition matrix
app.put("/api/composer/:composerId/melody/:melodyId/matrix", async (req, res) => {
  const composerId = req.params.composerId.toString()
  const melodyId = req.params.melodyId.toString()

  const db = client.db("test")
  const melodies = db.collection("melodies")
  const result = melodies.updateOne(
      {
        composerId: composerId,
        melodyId: melodyId
      },
      {
        $set: {
          transitionMatrix: req.body.matrix
        }
      },
      {
        upsert: true
      }
  )
  res.status(200).json({status:"ok"})
})

// puts a particular phrase structure
app.put("/api/composer/:composerId/melody/:melodyId/phrase-structure", async (req, res) => {
  const composerId = req.params.composerId.toString()
  const melodyId = req.params.melodyId.toString()

  const db = client.db("test")
  const melodies = db.collection("melodies")
  const result = melodies.updateOne(
      {
        composerId: composerId,
        melodyId: melodyId
      },
      {
        $set: {
          phraseStructure: req.body.phraseStructure
        }
      },
      {
        upsert: true
      }
  )
  res.status(200).json({status:"ok"})
})

// puts a particular harmonic progression
app.put("/api/composer/:composerId/melody/:melodyId/harmonicProgression", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const result = melodies.updateOne(
        {
            composerId: composerId,
            melodyId: melodyId
        },
        {
            $set: {
                harmonicProgression: req.body.harmonicProgression
            }
        },
        {
            upsert: true
        }
    )
    res.status(200).json({status:"ok"})
})

// puts a particular middleground melody
app.put("/api/composer/:composerId/melody/:melodyId/middleground-melody", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const result = melodies.updateOne(
        {
            composerId: composerId,
            melodyId: melodyId
        },
        {
            $set: {
                mgMelody: req.body.mgMelody
            }
        },
        {
            upsert: true
        }
    )
    res.status(200).json({status:"ok"})
})

///// LOGIN AND USER CREATION

// check whether a username exists in the database
app.get("/api/user-exists/:username", async (req, res) => {
    const username = req.params.username
    const db = client.db("test")
    const users = db.collection("users")

    const user = await users.find({ username: username }).toArray()

    if (user.length === 0) {
        res.status(404).json({status: "not found"})
        return
    }
    res.status(200).json({status:"ok"})
})

// gets particular user information
app.get("/api/find-user-info/:username", async (req, res) => {
    const username = req.params.username
    const db = client.db("test")
    const users = db.collection("users")

    const user = await users.find({ username: username }).toArray()
    if (user.length === 0) {
        res.status(404).json({status: "not found"})
        return
    }

    res.status(200).json({status: "ok"})
})

// returns composer id if username and password match
app.get("/api/login-info/:username/:password", async (req, res) => {
    const username = decodeURIComponent(req.params.username)
    const password = decodeURIComponent(req.params.password)
    const users = db.collection("users")

    const user = await users.find({ username: username }).toArray()
    const passwordHash = user[0]["passwordHash"]
    const passwordSalt = user[0]["passwordSalt"]

    const bitArray = hash.sha256.hash(password + passwordSalt)
    const givenHash = codec.hex.fromBits(bitArray)
    if (givenHash !== passwordHash) {
        res.status(401).json({status: "unauthorized"})
        return
    }

    const composerId = user[0]["composerId"]
    res.status(200).json({composerId})
})

// creates new user with salting and hashing
app.put("/api/create-user", async (req, res) => {
    const db = client.db("test")
    const users = db.collection("users")

    const salt = _makeid(32)
    const bitArray = hash.sha256.hash(req.body.password + salt)
    const passHash = codec.hex.fromBits(bitArray)

    const idSalt = _makeid(8)
    const idBitArray = hash.sha256.hash(req.body.username + idSalt)
    const idHash = codec.hex.fromBits(idBitArray)

    const result = users.insertOne({
        username: req.body.username,
        passwordHash: passHash,
        passwordSalt: salt,
        composerId: idHash,
        idSalt: idSalt
    })
    res.status(200).json({status:"ok"})
})

// creates a new 'empty' melody
app.put("/api/create-melody", async (req, res) => {
    console.log("inserting melodies", await db.collection("melodies").insertOne(req.body))
    res.status(200).json({status: "ok"})
})

// connect to Mongo
client.connect().then(() => {
    console.log('Connected successfully to MongoDB')
    db = client.db("test")
    melodies = db.collection('melodies')
    users = db.collection('users')

    // start server
    app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    })
})
