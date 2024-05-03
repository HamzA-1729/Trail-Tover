import express from "express";
import { isLoggedIn, validateReview, isReviewAuthor } from "../middleware.js";
import reviewController from "../controllers/reviews.js";
const router = express.Router({ mergeParams: true });


router.post("/", isLoggedIn, validateReview, reviewController.createReview);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReview);

export default router;