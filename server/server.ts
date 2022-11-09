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
