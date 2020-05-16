import QueryEngine from "./QueryEngine";

let q = new QueryEngine();

beforeAll(async () => await q.start());
afterAll(async () => await q.stop());

it("should return if customer exists", async () => {
  let r1 = await q.doesCustomerExists(1234567890);
  let r2 = await q.doesCustomerExists(0);

  expect(r1).toBe(true);
  expect(r2).toBe(false);
});

it("should return roles", async () => {
  let r1 = await q.getRoles();

  expect(r1).toEqual(expect.any(Array));
  expect(r1.length).toBeGreaterThan(0);
});

it("should return customer", async () => {
  let customer = await q.getCustomer(1234567890);

  let expectedCustomer: Customer = {
    phone: 1234567890,
    name: "John Doe",
    street: "5th Street",
    apt: "Skylights",
    flat_no: 42,
  };

  expect(customer).toEqual(expectedCustomer);
});

it("should add and remove customer", async () => {
  let customer: Customer = await q.getCustomer(1234567890);

  let exists = await q.doesCustomerExists(1234567890);
  expect(exists).toBe(true);

  await q.removeCustomer(1234567890);
  exists = await q.doesCustomerExists(1234567890);
  expect(exists).toBe(false);

  await q.addCustomer(customer);
  exists = await q.doesCustomerExists(1234567890);
  expect(exists).toBe(true);
});

it("should run queries", async () => {
  let r1 = await q.runQuery("select * from role");
  let r2 = await q.getRoles();

  expect(r1).toStrictEqual(r2);
});
