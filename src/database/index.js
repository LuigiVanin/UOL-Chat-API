import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URL);

// const mongoConnection = async () => {
//     let mongoClient = new MongoClient(process.env.MONGO_URL);
//     try {
//         await mongoClient.connect();
//     } catch (err) {
//         mongoClient = null;
//     } finally {
//         return mongoClient();
//     }
// };

export { mongoClient };
