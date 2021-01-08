import mongoose, { Schema, Document } from "mongoose";
import Course, { ICourse } from "./course";

export interface IClass extends Document {
    course: ICourse["_id"];
    time: Date;
    topic: string;
    averageAttendance: number;
    isFinished: boolean;
}

export interface IClassModel extends mongoose.Model<IClass>{
    updateCourseFromClass(this: IClassModel, classId: IClass["_id"]): Promise<IClass |null>;
}

const classSchema: Schema = new Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    time: { type: Date, required: true },
    topic: { type: String },
    averageAttendance: { type: Number, default: 0 },
    isFinished: {type: Boolean, default: false},
});

classSchema.statics.updateCourseFromClass = async function(this: IClassModel, classId: IClass["_id"]){
    let classDoc = await ClassModel.findById(classId);
    if(classDoc == null){
        return null;
    }
    // let course = await Course.findOneAndUpdate({_id: classDoc.course}, [{
    //     $addToSet: {classes: classId},
    //     averageAttendance : {
    //         $divide: [ {$add:[ classDoc.averageAttendance, {$multiply: ["$averageAttendance", {$size : "$classes"}]}]}, {$add: [1, {$size : "$classes"}]}]
    //     }
    // }]);

    // let prevCourse = await Course.findOneAndUpdate({_id: classDoc.course}, {$addToSet: {classes: classId}});
    // let updatedCourse = await Course.findById(classDoc.course);
    // console.log("updated Course", updatedCourse);
    
    
    // if(updatedCourse!=null && prevCourse?.classes.length != updatedCourse.classes.length){
    //     let newAverage = 0;
    //     if(updatedCourse.classes.length>0){
    //         newAverage = (classDoc.averageAttendance + (updatedCourse.classes.length-1)*updatedCourse.averageAttendance)/(updatedCourse.classes.length);
    //     }
    //     updatedCourse = await Course.findOneAndUpdate({_id: classDoc.course}, {averageAttendance: newAverage});
    // }
    return classDoc;
} 

// classSchema.post('save', async function (doc) {
//     let curClass: IClass = doc as IClass;
//     await ClassModel.updateCourseFromClass.call(ClassModel, curClass._id);
//     // console.log("curclass Course", curClass.course);
//     // mongoose.model('Course').update(
//     //     {_id: curClass.course, 'classes._id': {$ne: curClass._id}}, 
//     //     {$push: {classes: curClass}});
//     // let course = await mongoose.model('Course').findById(curClass.course);
//     // (course as ICourse).addClass(curClass);
//     // await mongoose.model('Course').update({_id: curClass.course}, {$addToSet: {classes: curClass._id}});
// })

// classSchema.post('findOneAndUpdate', async function (this: any) {
//     const curClass = await this.model.findOne(this.getQuery());
//     await ClassModel.updateCourseFromClass.call(ClassModel, curClass._id);
//     // console.log("curclass Course", curClass.course, curClass._id);
//     // console.log(await mongoose.model("Course").findOne({_id: curClass.course}));
//     // let course = await mongoose.model('Course').findById(curClass.course);
//     // if (course != null) {
//     //     // (course as ICourse).addClass(curClass);
//     //     (course as ICourse).averageAttendance = (((course as ICourse).classes.length) * ((course as ICourse).averageAttendance) + curClass.averageAttendance) / ((course as ICourse).classes.length + 1)
//     //     await mongoose.model('Course').update({_id: curClass.course}, {$addToSet: {classes: curClass._id}});
//     // }
// });
const ClassModel = mongoose.model<IClass, IClassModel>("Class", classSchema);
export default ClassModel;