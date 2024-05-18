import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import feedBack from "../models/feedBack.js";
const router = express.Router();

router.post("/feedback", feedBack);

export default router;
