import { MongoClient, Db, Collection } from "mongodb";

// get the mongo connection string from env
const MONGO_URI = process.env.MONGO_URI as string;

// error if not set
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is undefined");
}

const DB_NAME = "url-shortener";

// collection name for urls
export const URLS_COLLECTION = "urls-collection";

// keep client and db so we dont make new connections every time
let client: MongoClient | null = null;
let db: Db | null = null;

// connect to mongo and get the db
async function connect(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

// get a collection, reuses connection if we already have one
export default async function getCollection(
  collectionName: string,
): Promise<Collection> {
  if (!db) {
    db = await connect();
  }
  return db.collection(collectionName);
}

