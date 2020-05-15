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
