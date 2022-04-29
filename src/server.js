import chalk from "chalk";
import app from "./app.js";

app.listen(process.env.PORT, () => {
    console.log(
        chalk.bold.blue(`\n---\nAplicação no ar[PORT:${process.env.PORT}] 🚀`)
    );
});
