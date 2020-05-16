// import StateMachine from "./state-machine/StateMachine";

import StateMachine from "./state-machine/StateMachine";

(async () => {
  let machine = new StateMachine();
  await machine.run();
})();
