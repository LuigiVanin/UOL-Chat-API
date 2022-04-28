import { mongoClient } from "./database/index.js";
import express from "express";
import chalk from "chalk";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/", async (req, res) => {
    await mongoClient.connect();
    const db = mongoClient.db("uol-db");
    const test = await db
        .collection("test")
        .insertOne({ test: "sim é um test" });
    res.send({ message: "sabor do pecado" });
});

app.listen(process.env.PORT, () => {
    console.log(chalk.bold.blue("\n---\nAplicação no ar 🚀"));
});
