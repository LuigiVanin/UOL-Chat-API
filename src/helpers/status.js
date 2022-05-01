import chalk from "chalk";
import dayjs from "dayjs";
import { db } from "../database/index.js";

export function printStatus(request, data = null, status = "sucess") {
    console.log(
        "\n" +
            chalk.underline.yellow("Requisição:") +
            " " +
            chalk.bold.yellow(request)
    );
    if (status === "sucess") {
        console.log(chalk.bold.green(" \t● Sucesso!!"));
    } else if (status === "fail") {
        console.log(chalk.bold.red(" \t● Falha!!"));
    }

    if (data) {
        console.log("data:");
        console.log(data);
    }
    console.log(chalk.bold.blue("---\n"));
}

export function deleteInative(timer = 15, inativeTime = 10) {
    setInterval(async () => {
        let total = 0;
        db.collection("participants")
            .find({
                lastStatus: { $lt: Date.now() - inativeTime * 1000 },
            })
            .toArray()
            .then((data) => {
                total = data.length;

                data = data.map((user) => {
                    return {
                        from: user.name,
                        to: "Todos",
                        type: "status",
                        text: "sai da sala...",
                        time: dayjs(Date.now()).format("HH:mm:ss"),
                    };
                });
                if (data.length) {
                    db.collection("messages").insertMany(data);
                }
            });
        try {
            db.collection("participants").deleteMany({
                lastStatus: { $lt: Date.now() - inativeTime * 1000 },
            });
        } catch (e) {
            console.log(e);
        } finally {
            printStatus("Inative user DELETE", `Total deletions: ${total}`);
        }
    }, timer * 1000);
}
