import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.js";

const userController = {
    renderRegisterForm: (req, res) => {
        res.render("user/register");
    },
    renderLoginForm: (req, res) => {
        res.render("user/login");
    },
    logoutUser: (req, res, next) => {
        req.logOut(err => {
            if (err)
                return next(err);
            req.flash("success", "Successfully LoggedOut");
            res.redirect("/campgrounds");
        });
    },
    registerUser: catchAsync(async (req, res, next) => {
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

    }),
    loginUser: (req, res) => {
        req.flash("success", "Logged in successfully");
        res.redirect("/campgrounds");
    }

};

export default userController;