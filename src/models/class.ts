import mongoose, {Schema, Document} from "mongoose";
import { ICourse } from "./course";

export interface IClass extends Document{   
    course: ICourse["_id"];
    time: Date;
    topic: string;
    averageAttendance: number;
}

const classSchema: Schema = new Schema({
    course: {type: mongoose.Schema.Types.ObjectId, ref:'Course', required:true},
    time: {type:Date, required:true},
    topic: {type:String},
    averageAttendance: {type: Number, default:0},
});


classSchema.post('save', async function(doc){
    let curClass : IClass = doc as IClass;
    console.log("curclass Course", curClass.course);
    // mongoose.model('Course').update(
    //     {_id: curClass.course, 'classes._id': {$ne: curClass._id}}, 
    //     {$push: {classes: curClass}});
    await mongoose.model('Course').update({_id: curClass.course}, {$addToSet: {classes: curClass._id}});
})

classSchema.post('findOneAndUpdate', async function(this: any) {
    const curClass = await this.model.findOne(this.getQuery());
    // console.log("curclass Course", curClass.course, curClass._id);
    // console.log(await mongoose.model("Course").findOne({_id: curClass.course}));
    await mongoose.model('Course').update({_id: curClass.course}, {$addToSet: {classes: curClass._id}});
});
export default mongoose.model<IClass>("Class", classSchema);