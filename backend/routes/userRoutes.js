import express from "express";
import {
  register,
  login,
  refreshToken,
  getUserDetails
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh-token", refreshToken);
router.get("/", verifyToken, getUserDetails);

export default router;
