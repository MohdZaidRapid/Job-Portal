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
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - lastName
 *        - email
 *        - password
 *        - location
 *      properties:
 *        id:
 *           type: string
 *           description: The Auto-generated id of user collection
 *        name:
 *           type: string
 *           description: user name
 *        lastName:
 *           type: string
 *           description: User Last Name
 *        email:
 *           type: string
 *           description: User email address
 *        password:
 *           type: string
 *           description: User password >6 characters
 *        location:
 *           type: string
 *           description: user location city or country
 *        exmaple:
 *           id: DSREGFDTRGFGFG
 *           name: John
 *           lastName: Doe
 *           email: johndoe@gmail.com
 *           password: test@123
 *           location: mumbai
 *
 *
 */

// REGISTERED || POST
router.post("/register", limiter, registerController);

// LOGIN || POST
router.post("/login", limiter, loginController);

export default router;
