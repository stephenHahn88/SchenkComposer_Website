import { MongoClient, ObjectId } from 'mongodb'
import {Melody} from "./data";

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)


const melodies: Melody[] = [
  {
    _id: "test1",
    composerId: "1",
    composer: "Stephen"
  },
  {
    _id: "test2",
    composerId: "2",
    composer: "bob",
    meter: "6/4",
    harmonicProgression: ["I", "IV", "V", "I"]
  },
  {
    _id: "test3",
    composerId: "2",
    composer: "bob",
    meter: "4/4"
  }
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a customer cannot have more than one draft order
  // db.collection("orders").createIndex(
  //   { composerId: 1 },
  //   { partialFilterExpression: { state: "draft" } }
  // )

  // add data
  console.log("inserting customers", await db.collection("melodies").insertMany(melodies as any))

  process.exit(0)
}

main()
