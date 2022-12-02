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

// app routes
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

app.get("/api/composer/:composerId/melody/:melodyId/phrase-structure", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()

    if (mel == null || mel[0]["phraseStructure"] == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
    // @ts-ignore
    let result = mel[0]["phraseStructure"]
    res.status(200).json(result)
})

app.get("/api/composer/:composerId/melody/:melodyId/meter", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()

    if (mel == null || mel[0]["meter"] == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
    let result = mel[0]["meter"]
    res.status(200).json(result)
})

app.get("/api/composer/:composerId/melody/:melodyId/hypermeter", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()

    if (mel == null || mel[0]["hypermeter"] == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
    let result = mel[0]["hypermeter"]
    res.status(200).json(result)
})

app.get("/api/composer/:composerId/melody/:melodyId/mg-rhythm", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()

    if (mel == null || mel[0]["mgRhythm"] == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
    let result = mel[0]["mgRhythm"]
    res.status(200).json(result)
})

app.get("/api/composer/:composerId/melody/:melodyId/fg-rhythm", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()

    if (mel == null || mel[0]["fgRhythm"] == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
    let result = mel[0]["fgRhythm"]
    res.status(200).json(result)
})

app.get("/api/composer/:composerId/melody/:melodyId/matrix", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()

    if (mel == null || mel[0]["transitionMatrix"] == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
    let result = mel[0]["transitionMatrix"]
    res.status(200).json(result)
})

app.get("/api/composer/:composerId/melody/:melodyId/harmonicProgression", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()

    if (mel == null || mel[0]["harmonicProgression"] == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
    let result = mel[0]["harmonicProgression"]
    res.status(200).json(result)
})

app.get("/api/composer/:composerId/melody/:melodyId/middleground-melody", async (req, res) => {
    const composerId = req.params.composerId.toString()
    const melodyId = req.params.melodyId.toString()

    const db = client.db("test")
    const melodies = db.collection("melodies")
    const mel = await melodies.find({ composerId: composerId, melodyId: melodyId }).toArray()

    if (mel == null || mel[0]["mgMelody"] == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
    let result = mel[0]["mgMelody"]
    console.log(result)
    res.status(200).json(result)
})

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

// setup login and creation
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
