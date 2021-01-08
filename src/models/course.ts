import mongoose, {Schema, Document} from "mongoose";
import ClassModel, { IClass } from "./class";
import Teacher, { ITeacher } from "./teacher";

export interface ICourse extends Document{
    name: string;
    semester: string;
    year: number;
    teacher: ITeacher["_id"];
    averageAttendance: number;
    classes: IClass["_id"][];
    // assignTeacher(this:ICourse, teacher: ITeacher | ITeacher["_id"]) : Promise<ICourse>;
    addClass(this:ICourse, newClass: IClass | IClass["_id"]) : Promise<ICourse>;

}

export interface ICourseModel extends mongoose.Model<ICourse>{
    assignTeacher(this: ICourseModel, courseId: ICourse["_id"], teacherId: ITeacher["_id"]): Promise<ICourse | null>;
}

const courseSchema: Schema = new Schema({
    name: {type: String, required:true},
    semester: {type:String, enum:["Autumn", "Spring"], get: (v: string)=>v[0].toUpperCase() + v.slice(1).toLowerCase(), set: (v:string)=>v[0].toUpperCase() + v.slice(1).toLowerCase(), required:true},
    year: {type: Number, required:true}, //TODO: enter a validation for year
    teacher: {type:mongoose.Schema.Types.ObjectId, ref:'Teacher'},
    averageAttendance: {type: Number, default:0},
    classes: [{type:mongoose.Schema.Types.ObjectId, ref:"Class"}],
});

courseSchema.statics.assignTeacher = async function (this:ICourseModel, courseId: ICourse["_id"], teacherId: ITeacher["_id"]) {
    const teacher = await Teacher.findById(teacherId);
    if (teacher == null){
        return null;
    }
    else{
        const options = {upsert: true, new: true, setDefaultsOnInsert: true};
        let updatedCourse = await Course.findOneAndUpdate({_id: courseId}, {teacher: teacherId}, options);
        if(updatedCourse == null){
            return null;
        }
        await Teacher.findOneAndUpdate({_id: teacherId}, {$addToSet: {courses: courseId}});
        return updatedCourse;
    }
}

// courseSchema.methods.assignTeacher = async function (this:ICourse, teacher: ITeacher | ITeacher["_id"]) {
//     if(typeof(teacher) === "string"){
//         teacher = await Teacher.findById(teacher);
//     }
//     this.teacher = teacher; 
//     await mongoose.model('Teacher').update({_id: teacher._id}, {$addToSet: {courses: this._id}});

//     // console.log("course", this._id);
//     await teacher.save();
//     await this.save();
//     return this;
// }

// courseSchema.methods.addClass = async function (this:ICourse, newClass: IClass | IClass["_id"]) {
//     if(typeof(newClass) === "string"){
//         newClass = await ClassModel.findById(newClass);
//     }

//     if(newClass!=null){
//         console.log("addClass", (newClass as IClass).topic, this.classes.length, this.averageAttendance);
//         this.averageAttendance = ((this.classes.length)*(this.averageAttendance) + newClass.averageAttendance)/(this.classes.length+1)
//         await mongoose.model('Course').update({_id: this._id}, {$addToSet: {classes: newClass._id}});
//         await newClass.save();
//         await this.save();
//     }
//     return this;
// }

const Course =  mongoose.model<ICourse, ICourseModel>("Course", courseSchema);
export default Course;