import express from "express";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import Review from "../models/review.js";
import { isLoggedIn, validateCampground, isAuthor } from "../middleware.js";
const router = express.Router();


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})


router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    if (!campground) {
        req.flash("error", "OOps Campground not Created!");
        res.redirect("/campgrounds");
    }
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Campground Added Successfully!");
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id).populate({ path: "reviews", populate: { path: "author" } }).populate("author");
        if (!campground) {
            req.flash("error", "Oops! Campground not found.");
            return res.redirect("/campgrounds");
        }
        res.render('campgrounds/show', { campground });
    } catch (error) {
        req.flash("error", "Oops! Something went wrong while retrieving the campground.");
        res.redirect("/campgrounds");
    }
}));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "OOps Campground not Created!");
        return res.redirect("/campgrounds");
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Campground Updated Successfully!");
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Review.deleteMany({
        _id: {
            $in: campground.reviews
        }
    });
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground Deleted Successfully!");
    res.redirect('/campgrounds');
}));


export default router;