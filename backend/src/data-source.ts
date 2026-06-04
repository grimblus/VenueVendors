import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Venue } from "./entities/Venue";
import { Booking } from "./entities/Booking";
import { Reputation } from "./entities/Reputation";
import { PreferredVenue } from "./entities/PreferredVenue";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Venue, Booking, Reputation, PreferredVenue],
  synchronize: true,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});