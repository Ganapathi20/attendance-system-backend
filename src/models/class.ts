import mongoose, {Schema, Document} from "mongoose";
import { ICourse } from "./course";

export interface IClass extends Document{   
    course: ICourse["_id"];
    time: Date;
    topic: string;
}

const classSchema: Schema = new Schema({
    course: {type: mongoose.Schema.Types.ObjectId, ref:'Course', required:true},
    time: {type:Date, required:true},
    topic: {type:String},
});

export default mongoose.model<IClass>("Class", classSchema);