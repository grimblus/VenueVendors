import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venute.routes";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");
    app.listen(3001, () => console.log("Server running on port 3001"));
  })
  .catch((err) => console.error("DB connection failed:", err));