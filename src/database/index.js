import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URL);

export { mongoClient };
