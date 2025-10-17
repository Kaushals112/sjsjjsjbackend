import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import https from "https";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/booking.js";
import routeRoutes from "./routes/routes.js";
import servicesRoutes from "./routes/services.js";

import { keycloakAuth } from "./middleware/keycloakAuth.js";

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

// Initialize Express
const app = express();

// CORS: allow only frontend
app.use(
  cors({
    origin: "https://10.229.40.124:8081",
    credentials: true,
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Secure Backend is running over HTTPS...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", keycloakAuth, bookingRoutes);
app.use("/api/routes", keycloakAuth, routeRoutes);
app.use("/api/services", keycloakAuth, servicesRoutes);

// HTTPS configuration
const keyPath = process.env.SSL_KEY || "./10.229.40.124-key.pem";
const certPath = process.env.SSL_CERT || "./10.229.40.124.pem";
const PORT = process.env.PORT || 5000;

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

// Start HTTPS server
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS Server running at https://10.229.40.124:${PORT}`);
});
