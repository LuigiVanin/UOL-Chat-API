import dayjs from "dayjs";
import { Router } from "express";
import { mongoClient } from "../database/index.js";

const participants = Router();

participants.post("/participants", async (req, res) => {
    const { name } = req.body;
    console.log(name);
    if (!name) {
        return res.sendStatus(422);
    }
    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB);

        const nameCheck = await db
            .collection("participants")
            .find({ name: name })
            .toArray();
        if (nameCheck.length !== 0) {
            return res.sendStatus(409);
        }
        await db
            .collection("participants")
            .insertOne({ name, time: Date.now() });
        await db.collection("messages").insertOne({
            from: name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs(Date.now()).format("HH:mm:ss"),
        });
        return res.sendStatus(201);
    } catch (err) {
        console.log("Algum erro na conexão", err);
        return res.sendStatus(500);
    } finally {
        mongoClient.close();
    }
});

participants.get("/participants", async (req, res) => {});

export { participants };
