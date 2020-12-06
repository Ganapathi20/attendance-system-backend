import mongoose from "mongoose";
import { Response, Request, NextFunction } from "express";
import Course from "../models/course";
import checkBodyParams from "../middlewares/check-body-params";
import Student from "../models/student";
import Attendance from "../models/attendance";
import student from "./student";

const getCourse = async (request: Request, response: Response) => {
    try {
        const course = await Course.findById(request.params.id);
        if (course == null) {
            return response.status(404).json({ msg: `Course with id ${request.params.id} doesn't exisit` });
        }
        return response.json(course);
    }
    catch (err) {
        response.status(500).json({ error: err.message });
    }
}

const postCourse = async (request: Request, response: Response, next: NextFunction) => {
    try {

        let { name, year, semester }: { name: string, year: number, semester: string } = request.body;
        // TODO insert check on the year
        if (!name || !year || !semester) {
            return response.status(400).json({ msg: "Not all fields are entered" });
        }
        if (!(["Autumn", "Spring", "autumn", "spring"].includes(semester))) {
            return response.status(422).json({ msg: "Semester has to either Autumn or Spring" });
        }

        let oldCourse = await Course.findOne({ name: name, year: year, semester: semester });
        if (oldCourse !== null) {
            return response.status(400).json({ msg: `Course with id given details is already present` });
        }

        let newCourse = new Course({
            name: name,
            year: year,
            semester: semester
        });

        if (next) {
            request.newCourse = newCourse;
            next();
        }
        else {
            await newCourse.save();
            return response.json(newCourse);
        }
    }
    catch (err) {
        response.status(500).json({ error: err.message });
    }
}

const assignTeacherToCourse = async (request: Request, response: Response) => {
    try {
        request.newCourse = await request.newCourse.assignTeacher(request.teacher.id);
        // await request.newCourse.save();
        return response.status(200).json(request.newCourse.toJSON());
    }
    catch (err) {
        response.status(500).json({ error: err.message });
    }
}

const registerForCourse = [checkBodyParams("courseId"), async (request: Request, response: Response) => {
    try {
        request.student = await request.student.registerCourse(await Course.findById(request.body.courseId));
        return response.status(200).json(request.student.toJSON());
    }
    catch (err) {
        response.status(500).json({ error: err });
    }
}]

const getAllCourses = async (request: Request, response: Response) => {
    try {
        let courses = await Course.find();
        return response.status(200).json(courses);
    }
    catch (err) {
        response.status(500).json({ error: err });
    }
}

const getStudentAttendance = async (request: Request, response: Response) => {
    try {
        let courseId = request.query.courseId as string;
        let course = await Course.findById(courseId);
        if (course == null) {
            response.status(404).json(`Course with id ${courseId} not found`);
        }
        else {

            let regStudents = await Student.find({ "courses": mongoose.Types.ObjectId(courseId)}).exec();
            // console.log(regStudents);
            let numClasses = course.classes.length;
            let res = [];
            for (let student of regStudents) {
                let curAttendaces = await Attendance.find({ "class.course": courseId , "student": student._id, "isPresent": true }).exec();
                res.push({ ...(student.toJSON() as object), present: curAttendaces.length, absent: (numClasses - curAttendaces.length), attendance: (curAttendaces.length) / numClasses });
            }
            return response.status(200).json(res);
        }
    }
    catch (err){
        response.status(500).json({ error: err.message });
    }
}

export default {
    getCourse,
    postCourse,
    assignTeacherToCourse,
    registerForCourse,
    getAllCourses,
    getStudentAttendance,
}