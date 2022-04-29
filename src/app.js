// import { mongoClient } from "./database/index.js";
import { participants } from "./controllers/participantsController.js";
import { messages } from "./controllers/messageController.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/", participants);
app.use("/messages", messages);

app.use("/", async (req, res) => {
    res.send({ message: "pong" });
    // try {
    //     mongoClient.connect();
    //     const db = mongoClient.db(process.env.DB);
    //     const test = await db.collection("test").find({}).toArray();
    //     console.log(test);
    //     res.send({ message: "sabor do pecado" });
    // } catch (err) {
    //     console.log("something is wrong: ", err);
    //     res.sendStatus(500);
    // } finally {
    //     mongoClient.close();
    // }
});

export default app;
