import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";

import rateLimit from "express-rate-limit";

// ip limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// router object
const router = express.Router();

// routes

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The Auto-generated id of user collection
 *         name:
 *           type: string
 *           description: User name
 *         lastName:
 *           type: string
 *           description: User last name
 *         email:
 *           type: string
 *           description: User email address
 *         password:
 *           type: string
 *           description: User password >6 characters
 *         location:
 *           type: string
 *           description: User location city or country
 *       example:
 *         id: DSREGFDTRGFGFG
 *         name: John
 *         lastName: Doe
 *         email: johndoe@gmail.com
 *         password: test@123
 *         location: Mumbai
 */

/**
 *  @swagger
 *  tags:
 *    name: auth
 *    description: authentication apis
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

// REGISTERED || POST
router.post("/register", limiter, registerController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login page
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Something went wrong
 */

// LOGIN || POST
router.post("/login", limiter, loginController);

export default router;
