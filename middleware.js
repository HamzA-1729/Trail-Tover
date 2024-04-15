const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "U must be Logged In");
        return res.redirect("/login");
    }
    next();
};

export default isLoggedIn;