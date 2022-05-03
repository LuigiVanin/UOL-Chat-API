import dayjs from "dayjs";
import { Router } from "express";
import { db } from "../database/index.js";
import { userSchema } from "../schemas/user.js";
import { printStatus } from "../helpers/status.js";
import { stripHtml } from "string-strip-html";

const participants = Router();

participants.post("/participants", async (req, res) => {
    let { name } = req.body;
    name = name && stripHtml(name).result.trim();
    const validation = userSchema.validate({ name });
    if (validation.error) {
        return res.sendStatus(422);
    }
    try {
        const nameCheck = await db
            .collection("participants")
            .findOne({ name: name });
        if (nameCheck !== null) {
            return res.sendStatus(409);
        }
        await db
            .collection("participants")
            .insertOne({ name, lastStatus: Date.now() });
        const newMessage = {
            from: name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs(Date.now()).format("HH:mm:ss"),
        };
        await db.collection("messages").insertOne(newMessage);
        printStatus("/participants [POST]", newMessage);
        return res.status(201).send({ name });
    } catch (err) {
        console.log("Algum erro na conexão", err);
        return res.sendStatus(500);
    }
});

participants.get("/participants", async (req, res) => {
    try {
        const participants = await db
            .collection("participants")
            .find({})
            .toArray();
        printStatus("/participants [GET]");
        res.status(200).send(
            participants.map((part) => ({
                name: part.name,
                lastStatus: dayjs(part.lastStatus).format("HH:mm:ss"),
            }))
        );
    } catch (err) {
        console.log("Erro ao conectar com o banco de dados");
        res.sendStatus(500);
    }
});

// validação do user antes da conexão com o db (422)
participants.post("/status", async (req, res) => {
    let user = req.headers["user"];
    user = user && stripHtml(user).result.trim();
    const validation = userSchema.validate({ name: user });
    if (validation.error) {
        return res.sendStatus(422);
    }

    try {
        const userResult = await db
            .collection("participants")
            .findOne({ name: user });
        if (!userResult) {
            return res.sendStatus(404);
        }
        await db
            .collection("participants")
            .updateOne({ name: user }, { $set: { lastStatus: Date.now() } });
        res.status(201).send({
            message: {
                old: dayjs(userResult.lastStatus).format("HH:mm:ss"),
                new: dayjs(Date.now()).format("HH:mm:ss"),
            },
        });
        printStatus("/status [POST]");
        return;
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

export { participants };
