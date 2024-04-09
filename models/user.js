import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const { Schema } = mongoose;
const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);
export default mongoose.model("User", userSchema);