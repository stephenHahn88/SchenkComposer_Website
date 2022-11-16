import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'

// set up Mongo
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
let db: Db
let melodies: Collection

// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())

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

    if (mel == null) {
        res.status(404).json({composerId, melodyId})
        return
    }
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



// connect to Mongo
client.connect().then(() => {
  console.log('Connected successfully to MongoDB')
  db = client.db("test")
  melodies = db.collection('melodies')

  // start server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
})
