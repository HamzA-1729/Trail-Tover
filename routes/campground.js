import express from "express";
import { isLoggedIn, validateCampground, isAuthor } from "../middleware.js";
import campgroundController from "../controllers/campground.js";
const router = express.Router();

router.route("/")
    .get(campgroundController.index)
    .post(isLoggedIn, validateCampground, campgroundController.createCampground);

router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.route("/:id")
    .get(campgroundController.showCampground)
    .put(isLoggedIn, isAuthor, validateCampground, campgroundController.updateCampground)
    .delete(isLoggedIn, isAuthor, campgroundController.deleteCampground);

router.get('/:id/edit', isLoggedIn, isAuthor, campgroundController.renderEditForm);

export default router;