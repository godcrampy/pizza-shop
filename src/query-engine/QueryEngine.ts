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

  async getRoles(): Promise<any[]> {
    return ((await this.connection.execute("select * from role;")) as any)[0];
  }

  async doesCustomerExists(phone: number): Promise<boolean> {
    return (
      ((await this.connection.execute(`select * from customer where phone = ${phone}`)) as any)[0]
        .length !== 0
    );
  }
}

export default QueryEngine;
