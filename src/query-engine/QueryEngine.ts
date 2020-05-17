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

  async getRoles(): Promise<any[]> {
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

  async getDrinks(): Promise<PizzaFood[]> {
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
}

export default QueryEngine;
