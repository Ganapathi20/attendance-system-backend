import mongoose, {Schema, Document} from "mongoose";
import student from "../controllers/student";
import { IBatch } from "./batch";
import { ICourse } from "./course";
export interface IStudent extends Document{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    batch: IBatch["_id"];
    // attendance: [{course:ICourse["_id"], present:number, absent:number}]
    courses: [ICourse["_id"]];
    registerCourse(this:IStudent, course: ICourse | ICourse["_id"]): Promise<IStudent>;
}

const studentSchema = new Schema({
    email: {type:String, match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique:true},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    password: {type:String, required:true},
    batch: {type: mongoose.Schema.Types.ObjectId, ref:'Batch'},
    // coursesEnrolled: [{type: mongoose.Schema.Types.ObjectId, ref:'Course'}],
    // attendance: [{course:{type: mongoose.Schema.Types.ObjectId, ref:'Course', unique:true}, present:Number, absent:Number}]
    courses: [{type: mongoose.Schema.Types.ObjectId, ref:"Course"}],
});

studentSchema.methods.toJSON = function(this:IStudent){
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

studentSchema.methods.registerCourse = async function(this:IStudent, course: ICourse){
    mongoose.model('Student').update({_id: this._id, 'courses._id': {$ne: course._id}}, 
    {$push: {courses: course}});
    await mongoose.model('Student').update({_id: this._id}, {$addToSet: {courses: course._id}});
    // this.courses.push(course);
    // await this.save();
    let  updatedUser = await  mongoose.model('Student').findById(this._id);
    return updatedUser as IStudent;
}

export default mongoose.model<IStudent>('Student', studentSchema);