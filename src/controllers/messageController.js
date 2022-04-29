import dayjs from "dayjs";
import { Router } from "express";
import { mongoClient } from "../database/index.js";

const messages = Router();

messages.post("/", async (req, res) => {
    let user = req.headers["user"];
    const { message, to, type } = req.body;
    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB);
        const userCheck = await db
            .collection("participants")
            .findOne({ name: user });
        user = userCheck && userCheck.name;
        const newMessage = {
            from: user,
            to: to,
            message: message,
            type: type,
            time: dayjs(Date.now()).format("HH:mm:ss"),
        };
        // TODO: valisação com JOI
        // await db.collection("messages").insertOne(newMessage);
        res.status(201).send(newMessage);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    } finally {
        mongoClient.close();
    }
});

messages.get("/", async (req, res) => {
    const limit = req.query.limit || 100;
    const user = req.headers["user"];
    if (!user) return res.sendStatus(401);

    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB);
        let username = await db
            .collection("participants")
            .findOne({ name: user });
        username = username && username.name;
        if (!username) {
            res.sendStatus(401);
        } else {
            let result = await db
                .collection("messages")
                .find({})
                .sort({ _id: -1 }) // inverter banco para buscar mais recentes
                .limit(limit)
                .toArray();

            result = result
                .filter((msg) => {
                    if (msg.type === "private" && msg.to !== user) {
                        return false;
                    }
                    return true;
                })
                .map(({ from, to, type, message, time }) => {
                    return { from, to, type, message, time };
                });
            res.send(result);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    } finally {
        mongoClient.close();
    }
});

export { messages };
