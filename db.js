import { MongoClient } from "mongodb";

const connectionString = "mongodb+srv://danonmateo:mateoynacho123@movesonn.ktflaav.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(connectionString);

let conn;
try {
  // Try
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("austral");

export default db;
