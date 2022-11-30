import { MongoClient, ObjectId } from 'mongodb'
import {Melody, User} from "./data";

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const users: User[] = [
  {
    username: "Stephen",
    passwordHash: "32a8f8fea0426e809595694ce18f5ab14e286a61a90447fb43ee306c0430b675",
    passwordSalt: "hi",
    composerId: "1"
  }
]

const melodies: Melody[] = [
  {
    _id: "test1",
    composerId: "1",
    melodyId: "1",
    composer: "Stephen"
  },
  {
    _id: "test2",
    melodyId: "1",
    composerId: "2",
    composer: "bob",
    meter: "6/4",
    harmonicProgression: {"a": ["I", "IV", "V", "I"]}
  },
  {
    _id: "test3",
    melodyId: "2",
    composerId: "2",
    composer: "bob",
    meter: "4/4"
  },
  {
    _id: "test4",
    melodyId: "2",
    composerId: "1",
    composer: "Stephen",
    transitionMatrix: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ]
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
  console.log("inserting melodies", await db.collection("melodies").insertMany(melodies as any))
  console.log("inserting users", await db.collection("users").insertMany(users as any))

  process.exit(0)
}

main()
