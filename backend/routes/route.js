import express from "express";
import { signup } from "../Controller/authController.js";
import { login } from "../Controller/authController.js";
import { logout } from "../Controller/authController.js";
import {verifyEmail} from "../Controller/authController.js";
import {forgotPassword} from "../Controller/authController.js";
import {resetPassword} from "../Controller/authController.js";
import { checkAuth } from "../Controller/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router= express.Router();

router.get("/check-auth",verifyToken,checkAuth)
router.post("/signup",signup);
router.post("/verify-email",verifyEmail);
router.post("/login",login);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
router.post("/logout",logout);


export default router;

