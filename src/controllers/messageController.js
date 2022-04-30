import dayjs from "dayjs";
import { Router } from "express";
import { db } from "../database/index.js";
import { messageSchema } from "../schemas/message.js";
import { userSchema } from "../schemas/user.js";

const messages = Router();

messages.post("/", async (req, res) => {
    let user = req.headers["user"];
    const { text, to, type } = req.body;
    const validation = messageSchema.validate({
        to,
        text,
        from: user,
        type,
    });
    if (validation.error) {
        return res.sendStatus(422);
    }
    try {
        const userCheck = await db
            .collection("participants")
            .findOne({ name: user });
        if (!userCheck) {
            return res.sendStatus(401);
        }
        const newMessage = {
            ...validation.value,
            time: dayjs(Date.now()).format("HH:mm:ss"),
        };
        console.log(newMessage);
        await db.collection("messages").insertOne(newMessage);
        return res.status(201).send(newMessage);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

messages.get("/", async (req, res) => {
    const limit = req.query.limit || 100;
    const user = req.headers["user"];
    const validation = userSchema.validate({ name: user });
    if (validation.error) {
        return res.sendStatus(422);
    }
    try {
        let username = await db
            .collection("participants")
            .findOne({ name: user });
        username = username && username.name;
        if (!username) {
            return res.sendStatus(401);
        }
        let result = await db
            .collection("messages")
            .find({})
            .sort({ _id: -1 }) // inverter banco para buscar mais recentes
            .limit(Number(limit))
            .toArray();

        result = result
            .filter((msg) => {
                if (msg.type === "private_message" && msg.to !== user) {
                    return false;
                }
                return true;
            })
            .map(({ from, to, type, text, time }) => {
                return { from, to, type, text, time };
            });
        return res.send(result);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

export { messages };
