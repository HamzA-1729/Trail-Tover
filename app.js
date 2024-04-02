import express from "express";
import mongoose from "mongoose";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
import campground from "./routes/campground.js";
import review from "./routes/review.js";
import ExpressError from "./utils/ExpressError.js";


mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("Successfully connected to Database!!");
    })
    .catch(err => {
        console.log(err);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use("/campgrounds", campground);
app.use("/campgrounds/:id/review", review);


app.get('/', (req, res) => {
    res.render('home')
});



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})