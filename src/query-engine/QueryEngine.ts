import mysql from "mysql2/promise";
import config from "../config/db.config";

class QueryEngine {
  private connection!: mysql.Connection;
  private config: object;
  constructor() {
    this.config = config;
  }

  async start() {
    this.connection = await mysql.createConnection(this.config);
  }

  async stop() {
    await this.connection.end();
  }

  async runQuery(query: string) {
    return ((await this.connection.execute(query)) as any)[0];
  }

  async getRoles(): Promise<Role[]> {
    return ((await this.connection.execute("select * from role;")) as any)[0];
  }

  async doesCustomerExists(phone: number): Promise<boolean> {
    return (
      ((await this.connection.execute(`select * from customer where phone = ${phone}`)) as any)[0]
        .length !== 0
    );
  }

  async getCustomer(phone: number): Promise<Customer> {
    // * Assumes customer exists
    return ((await this.connection.execute(
      `select * from customer where phone = ${phone}`
    )) as any)[0][0];
  }

  async addCustomer(customer: Customer) {
    const { phone, name, street, apt, flat_no } = customer;
    await this.connection.execute(
      `insert into customer values(${phone}, "${name}", "${street}", "${apt}", ${flat_no});`
    );
  }

  async removeCustomer(phone: number | string) {
    await this.connection.execute(`delete from customer where phone = ${phone}`);
  }

  async getFood(): Promise<Food[]> {
    return ((await this.connection.execute(`select * from food;`)) as any)[0];
  }

  async getPizzas(): Promise<PizzaFood[]> {
    return ((await this.connection.execute(`select * from food natural join pizza;`)) as any)[0];
  }

  async getDrinks(): Promise<DrinkFood[]> {
    return ((await this.connection.execute(`select * from food natural join drink;`)) as any)[0];
  }

  async createOrder(phone: number): Promise<Order> {
    let time: number = +new Date();
    await this.connection.execute(`insert into orders values(${time}, ${phone});`);
    let order: Order = {
      id: time,
      phone,
    };
    return order;
  }

  async addContains(order: Order, foodQuantity: FoodQuantity) {
    const { food_id, quantity } = foodQuantity;
    await this.connection.execute(
      `insert into contains values(${order.id}, ${food_id}, ${quantity});`
    );
  }

  async createNewDrink(drink: DrinkFood): Promise<DrinkFood> {
    let food = await this.getFood();
    // * get max id
    let ids = food.map((f) => f.food_id);
    let maxId = Math.max.apply(null, ids);
    let newId = maxId + 1;
    drink.food_id = newId;

    await this.connection.execute(
      `insert into food values(${drink.food_id}, ${drink.price}, "${drink.name}");`
    );
    await this.connection.execute(`insert into drink values(${drink.food_id}, ${drink.quantity});`);
    return drink;
  }

  async createNewPizza(pizza: PizzaFood): Promise<PizzaFood> {
    let food = await this.getFood();
    // * get max id
    let ids = food.map((f) => f.food_id);
    let maxId = Math.max.apply(null, ids);
    let newId = maxId + 1;
    pizza.food_id = newId;

    await this.connection.execute(
      `insert into food values(${pizza.food_id}, ${pizza.price}, "${pizza.name}");`
    );
    await this.connection.execute(`insert into pizza values(${pizza.food_id}, ${pizza.size});`);
    return pizza;
  }

  async deleteFood(food_id: number) {
    await this.connection.execute(`delete from food where food_id=${food_id}`);
  }

  async updateRole(role: Role) {
    await this.connection.execute(
      `update role set salary=${role.salary} where role="${role.role}"`
    );
  }

  async addRole(role: Role) {
    await this.connection.execute(`insert into role values("${role.role}", ${role.salary});`);
  }

  async _deleteRole(role: Role) {
    // ! Not Exposes, only to facilitate tests
    await this.connection.execute(`delete from role where role="${role.role}"`);
  }

  async getEmployees(): Promise<EmployeeRole[]> {
    return ((await this.connection.execute(
      `select * from employee natural join role natural join pin order by id;`
    )) as any)[0];
  }

  async addEmployee(employee: Employee): Promise<Employee> {
    let emps = await this.getEmployees();
    // * get max id
    let ids = emps.map((e) => e.id);
    let maxId = Math.max.apply(null, ids);
    let newId = maxId + 1;
    employee.id = newId;
    const { apt, email, flat_no, id, name, pin, role, street } = employee;
    await this.connection.execute(
      `insert into employee values(${id}, "${name}", "${email}", "${street}", "${apt}", ${flat_no}, "${role}");`
    );
    try {
      await this.connection.execute(`insert into pin values("${street}", ${pin});`);
      // eslint-disable-next-line no-empty
    } catch {}

    return employee;
  }

  async removeEmployee(id: number) {
    await this.connection.execute(`delete from employee where id=${id}`);
  }

  async updateEmployee(employee: Employee) {
    const { apt, email, flat_no, id, name, role, street } = employee;
    await this.connection.execute(
      `update employee
      set name="${name}", email="${email}", street="${street}", apt="${apt}", flat_no=${flat_no}, role="${role}" 
      where id=${id}; `
    );
    `insert into employee values(1, "Leonard", "leonard@pizza.com", "theo street", "Hofstader Apartment", 4, "manager");`;
  }

  async getCustomers(): Promise<Customer[]> {
    return ((await this.connection.execute(`select * from customer;`)) as any)[0];
  }

  async getCustomerSpending(): Promise<any[]> {
    return ((await this.connection.execute(
      `select sum(price*quantity) as spent, customer.name, customer.phone from contains natural join food natural join orders, customer where customer.phone = orders.phone group by customer.phone;`
    )) as any)[0];
  }

  async getPopularItems(): Promise<any[]> {
    return ((await this.connection.execute(
      `select name, food_id, sum(quantity) as sold from contains natural join food group by food_id order by sum(quantity) desc;`
    )) as any)[0];
  }

  async getTodaysSale(): Promise<any[]> {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    return ((await this.connection.execute(
      `select quantity, price, name from orders natural join contains natural join food where id > ${+date} order by id;`
    )) as any)[0];
  }

  async addEmployeePhone(id: number, phone: number) {
    await this.connection.execute(`insert into phone values (${id}, ${phone})`);
  }

  async removeEmployeePhone(id: number, phone: number) {
    await this.connection.execute(`delete from phone where id=${id} and phone=${phone}`);
  }

  async showEmployeePhone(): Promise<any[]> {
    return ((await this.connection.execute(
      `select id, name, phone from phone natural join employee;`
    )) as any)[0];
  }
}

export default QueryEngine;
