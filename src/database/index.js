import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URL);

await mongoClient.connect();

const db = mongoClient.db(process.env.DB);

export { db };
