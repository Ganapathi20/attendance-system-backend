require("dotenv").config();
const mongoose = require("mongoose");

console.log("Mongo con string", process.env.MONGO_CON_STRING);
mongoose.connect(process.env.MONGO_CON_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) throw err;
    console.log("Mongo db connection established");
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const studentSchema = mongoose.Schema({
    firstName: {type: String, set: v=>v.toUpperCase()},
    lastName: {type: String, set: v=>v.toUpperCase()},
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    // coursesEnrolled: [{type: mongoose.Schema.Types.ObjectId, ref:'Course'}],
    attendance: [{ course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', unique: true }, present: Number, absent: Number }]
})
studentSchema.methods.addAttendance = (course, presentDays=0, absentDays) => {
    
    this.attendance.push({course: course, present: presentDays, absent})
}
const Student = mongoose.model('Student', studentSchema);
const batchSchema = mongoose.Schema({
    degree: { type: String, required: true, enum:["Btech", "Mtech"], get: v=>v[0].toUpperCase() + v.slice(1).toLowerCase(), set: v=>v[0].toUpperCase() + v.slice(1).toLowerCase()},
    year: { type: Number, required: true }, //TODO: enter a validation for year
    stream: {
        type: String, required: true,
        enum: ["CSE", "ECE", "DSAI"], //Note: update thing incase of new branch
        set: v => v.toUpperCase(),
        get: v => v.toUpperCase(),
    },
})
batchSchema.index({ degree: 1, year: 1, stream: 1 }, { unique: true });
batchSchema.virtual('desc').get(function() {return `${this.degree} ${this.stream} ${this.year}`}); // Can't use arrow fnction here
const Batch = mongoose.model("Batch", batchSchema);

this.degree="hello";;
this.stream = "false";


async function main() {

    let btechCse2014 = await Batch.findOne({degree:"Btech", year:2014, stream: "CSE"});
    console.log(btechCse2014, btechCse2014.desc)

    let batchCse2014_2 = await Batch.findOne({degree:"BTECH", year: 2014, stream: "cSe"});
    console.log("new", batchCse2014_2);

    let student = new Student({
        firstName: "Pratik",
        lastName: "Gupta",
        batch: btechCse2014,
    });
}

main().catch(e => console.log(e));
