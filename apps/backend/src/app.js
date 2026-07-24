import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

import routes from "./routes/index.js";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

// Compression
app.use(compression())

// Logger
app.use(morgan("dev"));

// API Routes
app.use("/api/v1", routes);

app.use(notFoundMiddleware)
app.use(errorMiddleware)

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ELIMINATE API is running 🚀",
  });
});

export default app;