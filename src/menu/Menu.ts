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
          default: 80,
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

  async takeOrder(phone: number): Promise<State> {
    // * List out items
    const food = await this.query.getFood();
    const pizzas = await this.query.getPizzas();
    const drinks = await this.query.getDrinks();
    console.log(chalk.bold.green("Pizzas"));
    console.table(pizzas);
    console.log();
    console.log(chalk.bold.green("Drinks"));
    console.table(drinks);
    // * Recursively ask for items and their quantity
    let confirm = true;
    let foodToQuantity = new Map<number, number>();
    while (confirm) {
      let res = await inquirer.prompt([
        {
          type: "number",
          message: "Select Items: ",
          name: "food_id",
        },
        {
          type: "number",
          message: "Select Quantity: ",
          name: "quantity",
          default: 1,
        },
      ]);

      if (foodToQuantity.has(res.food_id)) {
        let quantity: number = foodToQuantity.get(res.food_id)!;
        foodToQuantity.set(res.food_id, quantity + res.quantity);
      } else {
        foodToQuantity.set(res.food_id, res.quantity);
      }
      confirm = (
        await inquirer.prompt([
          {
            type: "confirm",
            message: "Add Items?",
            name: "confirm",
          },
        ])
      ).confirm;
    }
    console.table(foodToQuantity);
    // * Create order
    let order = await this.query.createOrder(phone);
    // * Add items to contains
    foodToQuantity.forEach(async (quantity, food_id) => {
      await this.query.addContains(order, { food_id, quantity });
    });
    // * Add up items show the bill
    let bill = 0;
    foodToQuantity.forEach((quantity, food_id) => {
      let foodItem: Food = food.find((e) => e.food_id === food_id)!;
      bill += foodItem.price * quantity;
    });
    console.log(chalk.bold.green(`Bill: ₹${bill}`));
    // * On payment start new cycle
    return State.Employee;
  }

  async promptAdminCategories(): Promise<State> {
    let res = await inquirer.prompt([
      {
        type: "list",
        name: "category",
        message: "Choose a category",
        choices: ["Employee", "Food", "Billing"],
      },
    ]);
    switch (res.category) {
      case "Employee":
        return State.AdminEmployee;
      case "Food":
        return State.AdminFood;
      case "Billing":
        return State.AdminBilling;
      default:
        return State.Admin;
    }
  }

  async promptAdminFood(): Promise<State> {
    let res = await inquirer.prompt([
      {
        type: "list",
        name: "category",
        message: "Select an action to perform",
        choices: ["List all Food Items", "Add Food Item", "Delete Food Item"],
      },
    ]);
    if (res.category === "List all Food Items") {
      let food = await this.query.getFood();
      console.table(food);
      return State.Admin;
    }
    if (res.category === "Add Food Item") {
      let res = await inquirer.prompt([
        {
          name: "type",
          type: "list",
          message: "Pizza or Drink",
          choices: ["Pizza", "Drink"],
        },
        {
          name: "name",
          type: "input",
          message: "Name",
        },
        {
          name: "price",
          type: "number",
          message: "Price",
        },
        {
          name: "size",
          type: "number",
          message: "Size/Quantity",
        },
      ]);
      if (res.type === "Pizza") {
        let p: PizzaFood = {
          food_id: 0,
          name: res.name,
          price: res.price,
          size: res.size,
        };
        await this.query.createNewPizza(p);
      } else {
        let d: DrinkFood = {
          food_id: 0,
          name: res.name,
          price: res.price,
          quantity: res.size,
        };
        await this.query.createNewDrink(d);
      }
      console.log(chalk.bold.green("Added New Food Item!"));
      return State.Admin;
    }

    if (res.category === "Delete Food Item") {
      let food = await this.query.getFood();
      console.table(food);
      let id = (
        await inquirer.prompt([
          {
            type: "number",
            name: "id",
            message: "Enter Food Id",
          },
        ])
      ).id;
      await this.query.deleteFood(id);
      console.log(chalk.bold.green("Deleted Food Item!"));
      return State.Admin;
    }

    return State.Admin;
  }
}

export default Menu;
