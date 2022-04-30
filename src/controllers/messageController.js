import dayjs from "dayjs";
import { Router } from "express";
import { db } from "../database/index.js";
import { printStatus } from "../helpers/status.js";
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
        await db.collection("messages").insertOne(newMessage);
        printStatus("/message[POST]", newMessage);
        return res.status(201).send(newMessage);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// TOFIX: achar maneira de ordenar mensagens corretamente
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
                msg.type === "private_message" &&
                msg.to !== user &&
                msg.from !== user
            ) {
                return false;
            }
            return true;
        });

        printStatus("messages/[GET]");
        return res.send(result.reverse());
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

export { messages };
