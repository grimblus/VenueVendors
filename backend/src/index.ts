import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import venueRoutes from "./routes/venue.routes";
import bookingRoutes from "./routes/booking.routes";
import preferredVenueRoutes from "./routes/preferredVenue.routes";
import reputationRoutes from "./routes/reputation.routes";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.get("/test", (req, res) => {
    res.json({ message: "Backend is reachable" });
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/preferred-venues", preferredVenueRoutes);
app.use("/api/reputation", reputationRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");
    app.listen(3001, () => console.log("Server running on port 3001"));
  })
  .catch((err) => console.error("DB connection failed:", err));