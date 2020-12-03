// const mongoose = require("mongoose")
import mongoose, {Schema, Document} from "mongoose";

export interface IBatch extends Document {
    degree: string;
    year: number;
    stream: string;
  }

const batchSchema: Schema = new Schema({
    degree: { type: String, required: true, enum:["Btech", "Mtech"], get: (v: string)=>v[0].toUpperCase() + v.slice(1).toLowerCase(), set: (v:string)=>v[0].toUpperCase() + v.slice(1).toLowerCase()},
    year: { type: Number, required: true }, //TODO: enter a validation for year
    stream: {
        type: String, required: true,
        enum: ["CSE", "ECE", "DSAI"], //Note: update thing incase of new branch
        set: (v:string) => v.toUpperCase(),
        get: (v: string) => v.toUpperCase(),
    },
})
batchSchema.index({ degree: 1, year: 1, stream: 1 }, { unique: true });
batchSchema.virtual('desc').get(function(this:{degree:IBatch["degree"], stream:IBatch["stream"], year:IBatch["year"]}){return `${this.degree} ${this.stream} ${this.year}`});
export default mongoose.model<IBatch>("Batch", batchSchema);