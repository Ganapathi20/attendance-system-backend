import Teacher, { ITeacher } from "./teacher";
import Student, { IStudent } from "./student";
import Batch, {IBatch} from "./batch";
import Course, { ICourse } from "./course";
import ClassModel, { IClass } from "./class";
import Attendance, { IAttendance } from "./attendance";
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

    // Clearing all attendance TODO remove it
    await Attendance.remove({});
    await ClassModel.remove({});

    // console.log(passwordHash);
    let teacherDoc = {
        firstName: "Santosh",
        lastName: "Kumar",
        email: "santosh@iiitnr.edu.in",
        password: passwordHash,
    };
    let teacher1 : ITeacher | null = new Teacher(teacherDoc);
    // await Teacher.deleteOne({email: teacherDoc.email});
    teacher1 = await Teacher.findOneAndUpdate({email: teacherDoc.email}, teacherDoc, options);
    // await teacher1.save();
    
    let course1Doc = {
        name: "OS",
        year: year,
        semester: semester,
    };
    // await Course.deleteOne(course1Doc);
    let course1 = await Course.findOneAndUpdate(course1Doc, {...course1Doc, }, options);
    await Course.assignTeacher(course1?._id, teacher1?._id);

    let class1Doc = {
        topic: "Intro",
        course: course1?._id
    };
    // await class1.save();
    // await ClassModel.deleteOne({topic: class1Doc.topic});
    let class1 = await ClassModel.findOneAndUpdate(class1Doc, {...class1Doc, time: new Date(year, month, date, hour, minute),averageAttendance:0}, options);
    // let class1 = await ClassModel.findOneAndUpdate(class1Doc, {...class1Doc, time: new Date(year, month, date, hour, minute)}, options);
    
    
    let class2Doc ={
        topic: "Process Management",
        course: course1?._id
    };
    // await ClassModel.deleteOne({topic: class2Doc.topic});
    let class2 = await ClassModel.findOneAndUpdate(class2Doc, {...class2Doc, time: new Date(year, month, date+1, hour, minute),averageAttendance:0}, options);
    // let class2 = await ClassModel.findOneAndUpdate(class2Doc, {...class2Doc, time: new Date(year, month, date+1, hour, minute)}, options);
    // await class2.save();
    

    let course2Doc = {
        name: "Database",
        year: year,
        semester: semester
    };
    // await Course.deleteOne(course2Doc);
    let course2 = await Course.findOneAndUpdate(course2Doc, {...course2Doc,}, options);
    await Course.assignTeacher(course2?._id, teacher1?._id);


    let course3Doc = {
        name: "Advanced Database",
        year: year,
        semester: semester
    };
    // await Course.deleteOne(course3Doc);
    let course3 = await Course.findOneAndUpdate(course3Doc, {...course3Doc,}, options);
    await Course.assignTeacher(course3?._id, teacher1?._id);

    
    let batch1Doc = {
        degree: "BTech",
        stream: "CSE",
        year: 2017,
    }
    let batch1 = await Batch.findOneAndUpdate(batch1Doc, batch1Doc, options);

    let student1Doc = {
        firstName: "Meenakshi",
        lastName: "K",
        email: "meenakshi@iiitnr.edu.in",
        roll: "17100020",
        password: passwordHash,
        batch: (batch1 as IBatch)._id,
    }
    await Course.deleteOne(course3Doc);
    let student1 = await Student.findOneAndUpdate({email: student1Doc.email}, student1Doc, options);
    await Student.registerCourse(student1?._id, course1?._id, );
    await Student.registerCourse(student1?._id, course2?._id, );
    
    
    let student2Doc = {
        firstName: "Mathla",
        lastName: "Sindhu",
        email: "mathla@iiitnr.edu.in",
        roll: "17100027",
        password: passwordHash,
        batch: (batch1 as IBatch)._id,
    }
    let student2 = await Student.findOneAndUpdate({email: student2Doc.email}, student2Doc, options);
    await Student.registerCourse(student2?._id, course1?._id, );
    await Student.registerCourse(student2?._id, course2?._id, );

    let student3Doc = {
        firstName: "Pratik",
        lastName: "Gupta",
        email: "pratik17100@iiitnr.edu.in",
        roll: "17100033",
        password: passwordHash,
        batch: (batch1 as IBatch)._id,
    }
    let student3 = await Student.findOneAndUpdate({email: student3Doc.email}, student3Doc, options);
    await Student.registerCourse(student3?._id, course1?._id, );
    await Student.registerCourse(student3?._id, course2?._id, );

    let student4Doc = {
        firstName: "Loveleen",
        lastName: "Amar",
        email: "loveleen@iiitnr.edu.in",
        roll: "17100025",
        password: passwordHash,
        batch: (batch1 as IBatch)._id,
    }
    let student4 = await Student.findOneAndUpdate({email: student4Doc.email}, student4Doc, options);
    await Student.registerCourse(student4?._id, course1?._id, );
    await Student.registerCourse(student4?._id, course2?._id, );

    let student5Doc = {
        firstName: "Loveleen",
        lastName: "Amar",
        email: "loveleen@iiitnr.edu.in",
        roll: "17100025",
        password: passwordHash,
        batch: (batch1 as IBatch)._id,
    }
    let student5 = await Student.findOneAndUpdate({email: student5Doc.email}, student5Doc, options);
    await Student.registerCourse(student5?._id, course1?._id, );
    await Student.registerCourse(student5?._id, course2?._id, );

    let attendance1Doc = {
        "class": class1?._id,
        "student": student1?._id,
        isPresent: true,
    }
    // await Attendance.deleteOne(attendance1Doc);
    let attendance1 = await Attendance.findOneAndUpdate(attendance1Doc, attendance1Doc, options);
    
    let attendance2Doc = {
        "class": class1?._id,
        "student": student2?._id,
        isPresent: true,
    }
    // await Attendance.deleteOne(attendance2Doc);
    let attendance2 = await Attendance.findOneAndUpdate(attendance2Doc, attendance2Doc, options);

    let attendance3Doc = {
        "class": class2?._id,
        "student": student1?._id,
        isPresent: true,
    }
    // await Attendance.deleteOne(attendance3Doc);
    let attendance3 = await Attendance.findOneAndUpdate(attendance3Doc, attendance3Doc, options);

    let attendance4Doc = {
        "class": class1?._id,
        "student": student4?._id,
        isPresent: true,
    }
    // await Attendance.deleteOne(attendance4Doc);
    let attendance4 = await Attendance.findOneAndUpdate(attendance4Doc, attendance4Doc, options);

    let attendance5Doc = {
        "class": class1?._id,
        "student": student5?._id,
        isPresent: true,
    }
    // await Attendance.deleteOne(attendance5Doc);
    let attendance5 = await Attendance.findOneAndUpdate(attendance5Doc, attendance5Doc, options);

    let attendance6Doc = {
        "class": class2?._id,
        "student": student4?._id,
        isPresent: true,
    }
    // await Attendance.deleteOne(attendance6Doc);
    let attendance6 = await Attendance.findOneAndUpdate(attendance6Doc, attendance6Doc, options);


}

export default {
    init
}