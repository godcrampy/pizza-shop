import State from "../state-machine/states";
import inquirer from "inquirer";
import chalk from "chalk";
import QueryEngine from "../query-engine/QueryEngine";
import StateMachine from "../state-machine/StateMachine";

class Menu {
  private query: QueryEngine;
  constructor() {
    this.query = new QueryEngine();
  }

  async initilize() {
    await this.query.start();
  }

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

  async goBack(): Promise<Boolean> {
    let answer = (
      await inquirer.prompt([
        {
          type: "list",
          name: "res",
          message: "Continue?",
          default: "Yes",
          choices: ["Yes", "Go Back"],
        },
      ])
    ).res;

    return answer === "Go Back";
  }

  async goBackToEmployee(state: State): Promise<State> {
    let goBack = await this.goBack();
    if (goBack) {
      return State.Employee;
    }
    return state;
  }

  async goBackToAdmin(state: State): Promise<State> {
    let goBack = await this.goBack();
    if (goBack) {
      return State.Admin;
    }
    return state;
  }

  async goBackState(state: State): Promise<State> {
    let goBack = await this.goBack();
    if (goBack) {
      return StateMachine.getPreviousState(state);
    }
    return state;
  }

  async promptCustomerDetails(): Promise<{ state: State; customer?: Customer }> {
    let phone = (
      await inquirer.prompt([
        {
          type: "number",
          name: "phone",
          message: "Customer Phone Number: ",
          default: 1234567890,
        },
      ])
    ).phone;

    let customerExists = await this.query.doesCustomerExists(phone);
    if (customerExists) {
      console.log(chalk.bold.green("Customer Exists!"));
      let customer = await this.query.getCustomer(phone);
      console.table(customer);
      return {
        state: State.CustomerFound,
        customer,
      };
    }

    console.log(chalk.bold.green("New Customer"));
    let goBack = await this.goBack();
    if (goBack) {
      return {
        state: State.Employee,
      };
    }

    // TODO: Add prompt to get user data
    let customer: Customer = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter Name: ",
      },
      {
        type: "input",
        name: "street",
        message: "Enter Street: ",
      },
      {
        type: "input",
        name: "apt",
        message: "Enter Apartment Name: ",
      },
      {
        type: "number",
        name: "flat_no",
        message: "Enter Flat Number: ",
      },
    ]);
    customer.phone = phone;
    console.table(customer);

    await this.query.addCustomer(customer);
    return {
      state: State.CustomerFound,
      customer,
    };
  }
}

export default Menu;
