import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const {Schema} = mongoose;

const UserScehma=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
UserScehma.plugin(passportLocalMongoose);

export default mongoose.model("User",UserScehma);
