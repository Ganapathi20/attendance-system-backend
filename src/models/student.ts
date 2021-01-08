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
    courses: ICourse["_id"][];
    roll: string;
    // registerCourse(this:IStudent, course: ICourse | ICourse["_id"]): Promise<IStudent>;
}

export interface IStudentModel extends mongoose.Model<IStudent>{
    registerCourse(this: IStudentModel, studentId: IStudent["_id"], courseId: ICourse["_id"]): Promise<IStudent | null>;
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
    roll: {type:String, unique:true, required: true},
});

studentSchema.methods.toJSON = function(this:IStudent){
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

// studentSchema.methods.registerCourse = async function(this:IStudent, course: ICourse){
//     // mongoose.model('Student').update({_id: this._id, 'courses._id': {$ne: course._id}}, 
//     // {$push: {courses: course}});
//     await mongoose.model('Student').update({_id: this._id}, {$addToSet: {courses: course._id}});
//     console.log("old", this);

//     let  updatedUser = await  mongoose.model('Student').findById(this._id);
//     console.log("new", updatedUser);
//     return updatedUser as IStudent;
// }

studentSchema.statics.registerCourse = async function(this: mongoose.Model<IStudent>, studentId: IStudent["_id"], courseId: ICourse["_id"]) {
    const options = {new: true, setDefaultsOnInsert: true, useFindAndModify: false };
    let updatedStudent = await this.findOneAndUpdate({_id: studentId}, {$addToSet: {courses: courseId}}, options);
    // console.log("student register course", updatedStudent);
    return updatedStudent;
}

const Student : IStudentModel = mongoose.model<IStudent, IStudentModel>('Student', studentSchema);
export default Student;