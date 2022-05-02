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
});

export default app;
