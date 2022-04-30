import chalk from "chalk";
import app from "./app.js";
import { deleteInative } from "./helpers/status.js";

const PORT = process.env.PORT || 5000;

deleteInative();

app.listen(PORT, () => {
    console.log(
        chalk.bold.blue(`\n---\nAplicação no ar[PORT:${process.env.PORT}] 🚀`)
    );
});
