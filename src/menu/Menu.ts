import State from "../state-machine/states";
import inquirer from "inquirer";
import chalk from "chalk";

class Menu {
  async promptAdminOrEmployee(): Promise<State> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let answer = await inquirer.prompt([
        {
          type: "list",
          name: "res",
          message: "Select Admin or Employee",
          default: "Employee",
          choices: ["Admin", "Employee"],
        },
      ]);
      if (answer.res === "Employee") {
        console.log(chalk.bold.green("User: Employee"));
        return State.Employee;
      }
      if (answer.res === "Admin") {
        let ans = await inquirer.prompt([
          {
            type: "password",
            name: "pass",
            message: "Enter admin credentials",
            default: "",
          },
        ]);
        if (ans.pass === "admin") {
          console.log(chalk.bold.green("User: Admin"));
          return State.Admin;
        }
        console.log(chalk.bold.red("Wrong Credentials"));
      }
    }
  }

  // async promptUserDetails(): Promise<{ state: State, customer: Customer }> {

  // }
}

export default Menu;
