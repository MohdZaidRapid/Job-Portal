// imports
import express from "express";
import dotnev from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";

// configure
dotnev.config();

//mongodb connection
connectDB();

// rest object
const app = express();

// routes
app.use("/api/v1/test", testRoutes);

// PORT
const PORT = process.env.PORT || 8080;

// listen
app.listen(8080, () => {
  console.log(
    `Node Server Running In  ${process.env.DEV_MODE} Mode on port no ${PORT}`
      .bgCyan.white
  );
});
