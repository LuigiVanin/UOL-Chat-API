import dayjs from "dayjs";
import { Router } from "express";
import { ObjectId } from "mongodb";
import { stripHtml } from "string-strip-html";
import { db } from "../database/index.js";
import { printStatus } from "../helpers/status.js";
import { messageSchema } from "../schemas/message.js";
import { userSchema } from "../schemas/user.js";

const messages = Router();

messages.post("/", async (req, res) => {
    let user = req.headers["user"];
    let { text, to, type } = req.body;
    // if (!user || !text) return res.sendStatus(422);
    user = user && stripHtml(user).result.trim();
    text = text && stripHtml(text).result.trim();

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
        await db.collection("messages").insertOne(newMessage);
        printStatus("/message [POST]", newMessage);
        return res.status(201).send(newMessage);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

messages.get("/", async (req, res) => {
    const limit = req.query.limit || 100;
    let user = req.headers["user"];
    // if (!user) return res.sendStatus(422);
    user = user && stripHtml(user).result.trim();
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

        // Enviar do mais novo ao mais velho: ordenar ao contrário(sort -1)
        // Pegar apenas os n primeiros valores: limit n
        // Inverter output pois o front print na ordem contrária da que chega: reverse()
        let result = await db
            .collection("messages")
            .find({})
            .limit(Number(limit))
            .sort({ _id: -1 })
            .toArray();

        result = result.filter((msg) => {
            if (
                msg.to !== "Todos" &&
                msg.type === "private_message" &&
                msg.to !== user &&
                msg.from !== user
            ) {
                return false;
            }
            return true;
        });

        printStatus("messages/ [GET]");
        return res.send(result.reverse());
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

messages.delete("/:idMessage", async (req, res) => {
    let user = req.headers["user"];
    const { idMessage } = req.params;
    // if (!user || !idMessage) {
    //     return res.sendStatus(422);
    // }
    user = user && stripHtml(user).result.trim();
    const validation = userSchema.validate({ name: user });
    if (validation.error || !idMessage) {
        return res.sendStatus(422);
    }
    try {
        const message = await db
            .collection("messages")
            .findOne({ _id: new ObjectId(idMessage) });
        if (!message) {
            return res.sendStatus(404);
        }
        if (message.from !== user) {
            return res.sendStatus(401);
        }
        const deleted = await db
            .collection("messages")
            .findOneAndDelete({ _id: new ObjectId(idMessage) });
        printStatus(`messages/${idMessage} [DELETE]`, deleted);
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

messages.put("/:idMessage", async (req, res) => {
    let user = req.headers["user"];
    let { text, to, type } = req.body;
    const { idMessage } = req.params;
    text = text && stripHtml(text).result.trim();
    user = user && stripHtml(user).result.trim();
    const validation = messageSchema.validate({ from: user, to, text, type });
    if (validation.error || !idMessage) {
        return res.sendStatus(422);
    }
    try {
        const message = await db
            .collection("messages")
            .findOne({ _id: new ObjectId(idMessage) });
        if (!message) {
            return res.sendStatus(404);
        }
        if (message.from !== user) {
            return res.sendStatus(401);
        }
        const updated = await db
            .collection("messages")
            .findOneAndUpdate(
                { _id: new ObjectId(idMessage) },
                { $set: { text: text } }
            );
        printStatus(`messages/${idMessage} [PUT]`, { ...message, text });
        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

export { messages };
