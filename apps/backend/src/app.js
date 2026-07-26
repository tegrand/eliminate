import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import path from "path";

import routes from "./routes/index.js";

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Serve static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// CORS
app.use(
    cors({
        origin: function(origin, callback) {
            // allow requests with no origin (like mobile apps or curl requests)
            if(!origin) return callback(null, true);
            if(origin.startsWith("http://localhost:")) {
                return callback(null, true);
            }
            if(origin === process.env.CLIENT_URL) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'), false);
        },
        credentials: true
    })
);

// Body and Cookie Parsers
app.use(express.json());
app.use(cookieParser());

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