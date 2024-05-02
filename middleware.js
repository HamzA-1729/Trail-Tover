import { campgroundSchema } from "./schemas.js";
import Campground from "./models/campground.js";
import ExpressError from "./utils/ExpressError.js";
import { reviewSchema } from "./schemas.js";
import Review from "./models/review.js";
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be Logged In");
        return res.redirect("/login");
    }
    next();
};

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "OOps u dont have the permission to access!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "OOps u dont have the permission to delete!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
export { isLoggedIn, validateCampground, isAuthor, validateReview, isReviewAuthor };