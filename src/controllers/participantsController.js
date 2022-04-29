import dayjs from "dayjs";
import { Router } from "express";
import { mongoClient } from "../database/index.js";

const participants = Router();

//FIXME: Fazer a validação de forma correta com JOI
participants.post("/participants", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.sendStatus(422);
    }
    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB);

        const nameCheck = await db
            .collection("participants")
            .findOne({ name: name });
        if (nameCheck !== null) {
            res.sendStatus(409);
        } else {
            await db
                .collection("participants")
                .insertOne({ name, time: Date.now() });
            const newMessage = {
                from: name,
                to: "Todos",
                text: "entra na sala...",
                type: "status",
                lastStatus: dayjs(Date.now()).format("HH:mm:ss"),
            };
            await db.collection("messages").insertOne(newMessage);
            res.sendStatus(201);
        }
    } catch (err) {
        console.log("Algum erro na conexão", err);
        return res.sendStatus(500);
    } finally {
        mongoClient.close();
    }
});

participants.get("/participants", async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB);
        const participants = await db
            .collection("participants")
            .find({})
            .toArray();
        res.status(200).send(
            participants.map((part) => ({
                name: part.name,
                lastStatus: dayjs(part.lastStatus).format("HH:mm:ss"),
            }))
        );
    } catch (err) {
        console.log("Erro ao conectar com o banco de dados");
        res.sendStatus(500);
    } finally {
        mongoClient.close();
    }
});

participants.post("/status", async (req, res) => {
    const user = req.headers["user"];
    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB);
        const userResult = await db
            .collection("participants")
            .findOne({ name: user });
        if (!userResult) {
            res.sendStatus(404);
        } else {
            await db
                .collection("participants")
                .updateOne(
                    { name: user },
                    { $set: { lastStatus: Date.now() } }
                );
            res.status(200).send({
                message: dayjs(Date.now()).format("HH:mm:ss"),
            });
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    } finally {
        mongoClient.close();
    }
});

export { participants };
