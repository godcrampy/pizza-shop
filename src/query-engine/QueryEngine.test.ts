/// <reference path="../types/customer.d.ts" />
/// <reference path="../types/food.d.ts" />
/// <reference path="../types/employee.d.ts" />
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

it("should get food", async () => {
  let food = await q.getFood();
  expect(food).toEqual(expect.any(Array));
  expect(food.length).toBeGreaterThan(0);
});

it("should get pizzas", async () => {
  let pizzas = await q.getPizzas();
  expect(pizzas).toEqual(expect.any(Array));
  expect(pizzas.length).toBeGreaterThan(0);
});

it("should get drinks", async () => {
  let drinks = await q.getDrinks();
  expect(drinks).toEqual(expect.any(Array));
  expect(drinks.length).toBeGreaterThan(0);
});

it("should create order", async () => {
  let length = (await q.runQuery("select count(*) as count from orders"))[0].count;
  let order: Order = await q.createOrder(1234567890);
  let newLength = (await q.runQuery("select count(*) as count from orders"))[0].count;
  expect(length + 1).toBe(newLength);
  await q.runQuery(`delete from orders where id = ${order.id}`);
  newLength = (await q.runQuery("select count(*) as count from orders"))[0].count;
  expect(length).toBe(newLength);
});

it("should add food items to contains", async () => {
  let order: Order = await q.createOrder(1234567890);
  let length = (await q.runQuery("select count(*) as count from contains"))[0].count;
  await q.addContains(order, { food_id: 1, quantity: 4 });
  let newLength = (await q.runQuery("select count(*) as count from contains"))[0].count;
  expect(length + 1).toBe(newLength);
  await q.runQuery(`delete from contains where id=${order.id} and food_id=${1}`);
  newLength = (await q.runQuery("select count(*) as count from contains"))[0].count;
  expect(length).toBe(newLength);
});

it("should create and delete new drink", async () => {
  let drinks = await q.getDrinks();
  let food = await q.getFood();
  let drink: DrinkFood = {
    food_id: 0,
    name: "New Drink",
    price: 50,
    quantity: 150,
  };
  drink = await q.createNewDrink(drink);
  const { food_id, name, price, quantity } = drink;
  let newDrinks = await q.getDrinks();
  let newFood = await q.getFood();

  expect(newDrinks.length).toBe(drinks.length + 1);
  expect(newFood.length).toBe(food.length + 1);
  expect(newFood.some((food) => food.food_id === food_id)).toBe(true);
  expect(newFood.some((food) => food.name === name)).toBe(true);
  expect(newFood.some((food) => food.price === price)).toBe(true);
  expect(newDrinks.some((drink) => drink.food_id === food_id)).toBe(true);
  expect(newDrinks.some((drink) => drink.name === name)).toBe(true);
  expect(newDrinks.some((drink) => drink.price === price)).toBe(true);
  expect(newDrinks.some((drink) => drink.quantity === quantity)).toBe(true);

  await q.deleteFood(food_id);

  newDrinks = await q.getDrinks();
  newFood = await q.getFood();

  expect(newDrinks.length).toBe(drinks.length);
  expect(newFood.length).toBe(food.length);
  expect(newFood.some((food) => food.food_id === food_id)).toBe(false);
  expect(newDrinks.some((drink) => drink.food_id === food_id)).toBe(false);
});

it("should create and delete new pizza", async () => {
  let pizzas = await q.getPizzas();
  let food = await q.getFood();
  let pizza: PizzaFood = {
    food_id: 0,
    name: "New Pizza",
    price: 50,
    size: 5,
  };
  pizza = await q.createNewPizza(pizza);
  const { food_id, name, price, size } = pizza;
  let newPizzas = await q.getPizzas();
  let newFood = await q.getFood();

  expect(newPizzas.length).toBe(pizzas.length + 1);
  expect(newFood.length).toBe(food.length + 1);
  expect(newFood.some((food) => food.food_id === food_id)).toBe(true);
  expect(newFood.some((food) => food.name === name)).toBe(true);
  expect(newFood.some((food) => food.price === price)).toBe(true);
  expect(newPizzas.some((pizza) => pizza.food_id === food_id)).toBe(true);
  expect(newPizzas.some((pizza) => pizza.name === name)).toBe(true);
  expect(newPizzas.some((pizza) => pizza.price === price)).toBe(true);
  expect(newPizzas.some((pizza) => pizza.size === size)).toBe(true);

  await q.deleteFood(food_id);

  newPizzas = await q.getPizzas();
  newFood = await q.getFood();

  expect(newPizzas.length).toBe(pizzas.length);
  expect(newFood.length).toBe(food.length);
  expect(newFood.some((food) => food.food_id === food_id)).toBe(false);
  expect(newPizzas.some((pizza) => pizza.food_id === food_id)).toBe(false);
});

it("shoud update role", async () => {
  let roles = await q.getRoles();
  let adminRole: Role = roles.find((role) => role.role === "admin")!;
  await q.updateRole({ role: "admin", salary: 1 });

  let newRoles = await q.getRoles();
  let newAdminRole: Role = newRoles.find((role) => role.role === "admin")!;
  expect(newAdminRole.salary).toBe(1);

  await q.updateRole(adminRole);

  newRoles = await q.getRoles();
  newAdminRole = newRoles.find((role) => role.role === "admin")!;
  expect(newAdminRole.salary).toBe(adminRole.salary);
});

it("shoud add role", async () => {
  const role: Role = {
    role: "ceo",
    salary: 100,
  };

  let roles = await q.getRoles();
  await q.addRole(role);
  let newRoles = await q.getRoles();

  expect(newRoles.length).toBe(roles.length + 1);
  expect(newRoles.some((r) => r.role === role.role)).toBe(true);

  await q._deleteRole(role);
  newRoles = await q.getRoles();
  expect(newRoles.length).toBe(roles.length);
  expect(newRoles.some((r) => r.role === role.role)).toBe(false);
});

it("should get employees", async () => {
  let emp: EmployeeRole[] = await q.getEmployees();
  expect(emp).toEqual(expect.any(Array));
  expect(emp.length).toBeGreaterThan(0);
});

it("should create and delete an employee", async () => {
  let employees = await q.getEmployees();
  let employee: Employee = {
    id: 0,
    name: "Dinesh",
    email: "dinesh@pizza.com",
    apt: "Sky",
    street: "MG road",
    pin: 41345,
    flat_no: 78,
    role: "waiter",
  };
  employee = await q.addEmployee(employee);
  const { apt, email, flat_no, id, name, pin, role, street } = employee;
  let newEmployees = await q.getEmployees();
  expect(newEmployees.length).toBe(employees.length + 1);
  expect(newEmployees.some((e) => e.apt === apt)).toBe(true);
  expect(newEmployees.some((e) => e.name === name)).toBe(true);
  expect(newEmployees.some((e) => e.email === email)).toBe(true);
  expect(newEmployees.some((e) => e.flat_no === flat_no)).toBe(true);
  expect(newEmployees.some((e) => e.id === id)).toBe(true);
  expect(newEmployees.some((e) => e.pin === pin)).toBe(true);
  expect(newEmployees.some((e) => e.role === role)).toBe(true);
  expect(newEmployees.some((e) => e.street === street)).toBe(true);

  await q.removeEmployee(id);

  newEmployees = await q.getEmployees();

  expect(newEmployees.length).toBe(employees.length);
  expect(newEmployees.some((e) => e.id === id)).toBe(false);
});

it("shoud update employee", async () => {
  let emps = await q.getEmployees();
  let employee = emps[0];

  let name = employee.name;

  employee.name = "Lemons";
  await q.updateEmployee(employee);
  let newEmps = await q.getEmployees();
  expect(newEmps.some((e) => e.name === "Lemons")).toBe(true);

  employee.name = name;
  await q.updateEmployee(employee);
  newEmps = await q.getEmployees();
  expect(newEmps.some((e) => e.name === name)).toBe(true);
});

it("should add and delete employee phone", async () => {
  let phones = await q.showEmployeePhone();
  await q.addEmployeePhone(5, 99);
  let newPhones = await q.showEmployeePhone();

  expect(newPhones.length).toBe(phones.length + 1);

  await q.removeEmployeePhone(5, 99);
  newPhones = await q.showEmployeePhone();

  expect(newPhones.length).toBe(phones.length);
});

it("should return customers", async () => {
  let r1 = await q.getCustomers();
  expect(r1).toEqual(expect.any(Array));
  expect(r1.length).toBeGreaterThan(0);
});

it("should return customer spending", async () => {
  let r1 = await q.getCustomerSpending();
  expect(r1).toEqual(expect.any(Array));
  expect(r1.length).toBeGreaterThan(0);
});

it("should return popular items", async () => {
  let r1 = await q.getPopularItems();
  expect(r1).toEqual(expect.any(Array));
  expect(r1.length).toBeGreaterThan(0);
});

it("should return todays sale", async () => {
  let r1 = await q.getTodaysSale();
  expect(r1).toEqual(expect.any(Array));
});
