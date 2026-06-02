import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "diptodatabase.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
  port: 1433,
  username: "s4095942",
  password: "AL53?)~]",
  database: "s4095942",

  entities: ["src/entities/*.ts"],
  synchronize: true,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});