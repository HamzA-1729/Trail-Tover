import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

export default mongoose.model('Campground', CampgroundSchema);