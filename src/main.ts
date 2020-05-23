// import StateMachine from "./state-machine/StateMachine";

import StateMachine from "./state-machine/StateMachine";
import clear from "clear";
import figlet from "figlet";
import chalk from "chalk";

(async () => {
  clear();
  console.log(
    chalk.yellowBright(
      figlet.textSync("Pizza Shop", {
        font: "ANSI Shadow",
      }) + chalk.bold(" v1.0.0")
    )
  );
  let machine = new StateMachine();
  await machine.run();
})();
