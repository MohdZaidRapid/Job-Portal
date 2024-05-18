// API documentation
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
// packages import
import http from "http";
import { Server } from "socket.io";
import express from "express";
import dotnev from "dotenv";
import "express-async-errors";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
//security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
//files imports
import connectDB from "./config/db.js";

import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddlware from "./middlewares/errorMiddleware.js";
import jobsRoutes from "./routes/jobsRoute.js";
import userRoutes from "./routes/userRoutes.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import feedBackRoutes from "./routes/feedbackRoutes.js";

// configure
dotnev.config();

//mongodb connection
connectDB();

// Swagger api config
// Swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        // url: "http://localhost:8080",
        url: "https://job-portal-82w3.onrender.com",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// rest object
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket io
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("subscribeToNotifications", (userId) => {
    console.log(`User ${userId} subscribed to notifications`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

//middleware

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

console.log(__dirname);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);
app.use("/api/v1/feedback", feedBackRoutes);

// homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// validation middleware
app.use(errorMiddlware);

// PORT
const PORT = process.env.PORT || 8080;

export const sendNotification = (userId, message) => {
  io.to(userId).emit("notification", message);
};

// listen
server.listen(8080, () => {
  console.log(
    `Node Server Running In  ${process.env.DEV_MODE} Mode on port no ${PORT}`
      .bgCyan.white
  );
});
