import State from "./states";
import Menu from "../menu/Menu";

class StateMachine {
  private state: State;
  private menu: Menu;
  constructor() {
    this.state = State.Initialize;
    this.menu = new Menu();
  }

  async run() {
    let state: State = State.Initialize;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      switch (this.state) {
        case State.Initialize:
          state = await this.menu.promptAdminOrEmployee();
          if (state === State.Admin) console.log("Admin");
          if (state === State.Employee) console.log("Employee");
          break;

        default:
          state = State.Initialize;
          break;
      }
      this.state = state;
    }
  }
}

export default StateMachine;
