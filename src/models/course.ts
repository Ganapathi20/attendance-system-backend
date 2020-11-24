import { triggerAsyncId } from "async_hooks";
import mongoose, {Schema, Document} from "mongoose";

export interface ICourse extends Document{
    name: string,
    semester: string,
}

const CourseSchema: Schema = new Schema({
    name: {type: String, required:true},
    semester: {type:String, enum:["Autumn", "Spring"], get: (v: string)=>v[0].toUpperCase() + v.slice(1).toLowerCase(), set: (v:string)=>v[0].toUpperCase() + v.slice(1).toLowerCase(), required:true},
    year: {type: Number, required:true}, //TODO: enter a validation for year
});

export default mongoose.model<ICourse>("Course", CourseSchema);