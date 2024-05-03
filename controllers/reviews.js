import Review from "../models/review.js";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";

const reviewController = {
    createReview: catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success", "Review Added Successfully!");
        res.redirect(`/campgrounds/${campground._id}`);
    }),
    deleteReview: catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Review.findByIdAndDelete(reviewId);
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        req.flash("success", "Review Deleted Successfully!");
        res.redirect(`/campgrounds/${id}`);
    })
};

export default reviewController;