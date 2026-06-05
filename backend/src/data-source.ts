import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Venue } from "./entities/Venue";
import { Booking } from "./entities/Booking";
import { PreferredVenue } from "./entities/PreferredVenue";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
  port: 1433,
  username: "s4095942",
  password: "DigBuh2000!@#$",
  database: "s4095942",
  entities: [User, Venue, Booking, PreferredVenue],
  synchronize: true,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});