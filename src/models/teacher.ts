import mongoose, {Schema, Document} from "mongoose";
import { ICourse } from "./course";
export interface ITeacher extends Document{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    courses: [ICourse["_id"]];
}

const teacherSchema = new Schema({
    email: {type:String, match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique:true},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    password: {type:String, required:true},
    courses: [{type:mongoose.Schema.Types.ObjectId, ref:'Course'}]
});

teacherSchema.methods.toJSON = function(this:ITeacher){
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

export default mongoose.model<ITeacher>('Teacher', teacherSchema);