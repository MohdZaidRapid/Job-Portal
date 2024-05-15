// API documentation
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
// packages import
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
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);

// rest object
const app = express();

//middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);

// homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// validation middleware
app.use(errorMiddlware);

// PORT
const PORT = process.env.PORT || 8080;

// listen
app.listen(8080, () => {});
