import express from "express";
import passport from "passport";
import userController from "../controllers/users.js";

const router = express.Router();
router.route("/register")
    .get(userController.renderRegisterForm)
    .post(userController.registerUser);

router.route("/login")
    .get(userController.renderLoginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), userController.loginUser);

router.get("/logout", userController.logoutUser);

export default router;