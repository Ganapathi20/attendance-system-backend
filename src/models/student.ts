import mongoose, {Schema, Document} from "mongoose";
import { IBatch } from "./batch";
import { ICourse } from "./course";
export interface IStudent extends Document{
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    batch: IBatch["_id"];
    attendance: [{course:ICourse["_id"], present:number, absent:number}]
}

const StudentSchema = new Schema({
    email: {type:String, match:/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, unique:true},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    password: {type:String, required:true},
    batch: {type: mongoose.Schema.Types.ObjectId, ref:'Batch'},
    // coursesEnrolled: [{type: mongoose.Schema.Types.ObjectId, ref:'Course'}],
    attendance: [{course:{type: mongoose.Schema.Types.ObjectId, ref:'Course', unique:true}, present:Number, absent:Number}]
});

StudentSchema.methods.toJSON = function(this:IStudent){
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

export default mongoose.model<IStudent>('Student', StudentSchema);