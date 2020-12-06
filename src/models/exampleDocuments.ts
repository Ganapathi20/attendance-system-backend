import Teacher, { ITeacher } from "./teacher";
import Student, { IStudent } from "./student";
import Batch, {IBatch} from "./batch";
import Course, { ICourse } from "./course";
import ClassModel, { IClass } from "./class";
import bcrypt from "bcryptjs";
import SALT from "../bcrypt-salt";

async function init(){
    const password = "abcd1234";
    // const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, SALT);
    let year = 2020;
    let month = 11;
    let date = 1;
    let hour = 15;
    let minute = 5;
    let semester = "spring";
    let degree = "BTech";
    let stream = "CSE";
    const options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };

    // console.log(passwordHash);
    let teacherDoc = {
        firstName: "Santosh",
        lastName: "Kumar",
        email: "santosh@iiitnr.edu.in",
        password: passwordHash,
    };
    let teacher1 : ITeacher | null = new Teacher(teacherDoc);
    teacher1 = await Teacher.findOneAndUpdate({email: teacherDoc.email}, teacherDoc, options);
    // await teacher1.save();
    
    let course1Doc = {
        name: "OS",
        year: year,
        semester: semester
    };
    let course1 = await Course.findOneAndUpdate(course1Doc, course1Doc, options);
    await (course1 as ICourse).assignTeacher(teacher1);

    let class1Doc = {
        topic: "Intro",
        time: new Date(year, month, date, hour, minute),
        course: course1?._id
    };
    // await class1.save();
    let class1 = await ClassModel.findOneAndUpdate(class1Doc, class1Doc, options);
    
    
    let class2Doc ={
        topic: "Process Management",
        time: new Date(year, month, date+1, hour, minute),
        course: course1?._id
    };
    let class2 = await ClassModel.findOneAndUpdate(class2Doc, class2Doc, options);
    // await class2.save();
    

    let course2Doc = {
        name: "Database",
        year: year,
        semester: semester
    };
    let course2 = await Course.findOneAndUpdate(course2Doc, course2Doc, options);
    await (course2 as ICourse).assignTeacher(teacher1);

    let course3Doc = {
        name: "Advanced Database",
        year: year,
        semester: semester
    };
    let course3 = await Course.findOneAndUpdate(course3Doc, course3Doc, options);
    await (course3 as ICourse).assignTeacher(teacher1);


    let batch1Doc = {
        degree: "BTech",
        stream: "CSE",
        year: 2017,
    }
    let batch1 = await Batch.findOneAndUpdate(batch1Doc, batch1Doc, options);

    let student1Doc = {
        firstName: "Pratik",
        lastName: "Gupta",
        email: "pratik17100@iiitnr.edu.in",
        password: passwordHash,
        batch: (batch1 as IBatch)._id,
    }
    let student1 = await Student.findOneAndUpdate({email: student1Doc.email}, student1Doc, options);
    await (student1 as IStudent).registerCourse(course1);
    await (student1 as IStudent).registerCourse(course2);
}

export default {
    init
}