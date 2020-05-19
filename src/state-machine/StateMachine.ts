import State from "./states";
import Menu from "../menu/Menu";

class StateMachine {
  static getPreviousState(state: State): State {
    switch (state) {
      case State.Employee:
        return State.Initialize;
      case State.Admin:
        return State.Initialize;
      default:
        return State.Initialize;
    }
  }

  private state: State;
  private menu: Menu;
  private customer: Customer | undefined;
  constructor() {
    this.state = State.Initialize;
    this.menu = new Menu();
  }

  async run() {
    let state: State = State.Initialize;
    await this.menu.initilize();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.state === State.Initialize) {
        // * Initial State: Choose Admin or Employee
        state = await this.menu.promptAdminOrEmployee();
      } else if (this.state === State.Employee) {
        // * Employee State: Get Customer Details
        let res = await this.menu.promptCustomerDetails();
        state = res.state;
        this.customer = res.customer;
        if (this.customer) {
          state = await this.menu.goBackToEmployee(state);
        }
      } else if (this.state === State.CustomerFound) {
        state = await this.menu.takeOrder(this.customer?.phone!);
      } else if (this.state === State.Admin) {
        state = await this.menu.promptAdminCategories();
      } else if (this.state === State.AdminFood) {
        state = await this.menu.promptAdminFood();
      } else if (this.state === State.AdminEmployee) {
        state = await this.menu.promptAdminEmployee();
        // * Edit role salary
        // * Add role
        // * Delete role
        // * Add employee
        // * Change employee role
        // * Delete employee
      } else {
        state = State.Initialize;
      }
      this.state = state;
    }
  }
}

export default StateMachine;
