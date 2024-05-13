// package imports
import express from "express";
import dotnev from "dotenv";
import 'express-async-errors'
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddlware from "./middlewares/errorMiddleware.js";

// configure
dotnev.config();

//mongodb connection
connectDB();

// rest object
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);

// validation middleware
app.use(errorMiddlware); 

// PORT
const PORT = process.env.PORT || 8080;

// listen
app.listen(8080, () => {
  console.log(
    `Node Server Running In  ${process.env.DEV_MODE} Mode on port no ${PORT}`
      .bgCyan.white
  );
});
