import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Venue } from "./entities/Venue";
import { Booking } from "./entities/Booking";
import { Reputation } from "./entities/Reputation";
import { PreferredVenue } from "./entities/PreferredVenue";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "diptodatabase.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
  port: 1433,
  username: "s4095942",
  password: "AL53?)~]",
  database: "s4095942",

  entities: [User, Venue, Booking, Reputation, PreferredVenue],
  synchronize: true,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});