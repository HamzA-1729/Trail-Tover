import express from "express";
import User from "../models/user.js";
import passport from "passport";
import catchAsync from "../utils/catchAsync.js";
const router = express.Router();

router.get("/register", (req, res) => {
    res.render("user/register");
});

router.get("/login", (req, res) => {
    res.render("user/login");
});

router.get("/logout", (req, res, next) => {
    req.logOut(err => {
        if (err)
            return next(err);
        req.flash("success", "Successfully LoggedOut");
        res.redirect("/campgrounds");
    });
});

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.logIn(registerUser, err => {
            if (err) return next(err);
            req.flash("success", "Register successfully");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }

}));

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect("/campgrounds");
});

export default router;