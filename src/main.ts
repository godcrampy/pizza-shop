// import StateMachine from "./state-machine/StateMachine";

import QueryEngine from "./query-engine/QueryEngine";

(async () => {
  let q = new QueryEngine();
  console.log("Starting");
  await q.start();
  console.log("Getting Roles");
  let res = await q.doesCustomerExists(9876543210);
  console.log(res);

  await q.stop();
})();
