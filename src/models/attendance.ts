import mongoose, {Schema, Document} from "mongoose";
import { IClass } from "./class";
import { IStudent } from "./student";
    // attendance: [{course:ICourse["_id"], present:number, absent:number}]

export interface IAttendance extends Document{
    "class":IClass["_id"];
    student: IStudent["_id"];
    isPresent:boolean;
}

const attendanceSchema = new Schema({
    "class": {type:mongoose.Schema.Types.ObjectId, ref:"Class", required:true},
    student: {type:mongoose.Schema.Types.ObjectId, ref:"Student", required:true},
    isPresent: Boolean,
});

attendanceSchema.index({ "class": 1, "student": 1, isPresent: 1 }, { unique: true });
export default mongoose.model<IAttendance>('Attendance', attendanceSchema);

