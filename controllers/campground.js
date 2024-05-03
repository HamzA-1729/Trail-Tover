import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import Review from "../models/review.js";

const campgroundController = {
    index: catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    }),

    renderNewForm: (req, res) => {
        res.render('campgrounds/new');
    },

    createCampground: catchAsync(async (req, res, next) => {
        try {
            const campground = new Campground(req.body.campground);
            campground.author = req.user._id;
            await campground.save();
            req.flash("success", "Campground Added Successfully!");
            res.redirect(`/campgrounds/${campground._id}`);
        } catch (error) {
            req.flash("error", "OOps Campground not Created!");
            res.redirect("/campgrounds");
        }
    }),

    renderEditForm: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const campground = await Campground.findById(id);
            if (!campground) {
                req.flash("error", "OOps Campground not Created!");
                return res.redirect("/campgrounds");
            }
            res.render('campgrounds/edit', { campground });
        } catch (error) {
            req.flash("error", "Oops! Something went wrong.");
            res.redirect("/campgrounds");
        }
    }),

    updateCampground: catchAsync(async (req, res) => {
        try {
            const { id } = req.params;
            const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
            req.flash("success", "Campground Updated Successfully!");
            res.redirect(`/campgrounds/${id}`);
        } catch (error) {
            req.flash("error", "Oops! Something went wrong.");
            res.redirect("/campgrounds");
        }
    }),

    deleteCampground: catchAsync(async (req, res) => {
        try {
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
        } catch (error) {
            req.flash("error", "Oops! Something went wrong.");
            res.redirect("/campgrounds");
        }
    }),

    showCampground: catchAsync(async (req, res) => {
        try {
            const campground = await Campground.findById(req.params.id)
                .populate({ path: "reviews", populate: { path: "author" } })
                .populate("author");
            if (!campground) {
                req.flash("error", "Oops! Campground not found.");
                return res.redirect("/campgrounds");
            }
            res.render('campgrounds/show', { campground });
        } catch (error) {
            req.flash("error", "Oops! Something went wrong while retrieving the campground.");
            res.redirect("/campgrounds");
        }
    })
};

export default campgroundController;
