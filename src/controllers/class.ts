import mongoose from "mongoose";
import { Request, Response } from "express";
import Course from "../models/course";
import Student from "../models/student";
import Attendance from "../models/attendance";
import ClassModel, { IClass } from "../models/class";

const getClass = async (request: Request, response: Response) => {
    try {
        const classInstance = await ClassModel.findOne({ "_id": request.params.id }).populate('course');
        if (classInstance === null) {
            return response.status(404).json({ msg: `Class with id ${request.params.id} doesn't exisit` });
        }
        return response.json(classInstance);
    }
    catch (err) {
        response.status(500).json({ error: err.message });
    }
}

const postClass = async (request: Request, response: Response) => {
    try{

        let {topic, courseId, hour, minute, date, month, year} : {topic: string, courseId: string, hour: number, minute: number, date: number, month: number, year: number} =  request.body;
        // Note that month is index of the month
        if(!topic || !courseId || hour===undefined || minute===undefined || !date ){
            console.log(topic, courseId, hour, minute, date);
            return response.status(400).json({msg: `Not all fields are entered`});
        }
        if(!month){
            month = new Date().getMonth();
        }
        if(!year){
            year = new Date().getFullYear();
        }
        let curDate = new Date(year, month, date, hour, minute);
        let course = await Course.findById(courseId);
        if(course === null){
            return response.status(404).json({msg: `Course with id ${courseId} doesn't exist`})
        }
        let newClass = new ClassModel({
            topic: topic,
            time: curDate,
            course: course?._id
        });
        await newClass.save();
        
        return response.json(newClass);
    }
    catch(err){
        return response.status(500).json({error: err.message});
    }
}

const getStudentsAttendance = async (request: Request, response: Response) => {
    try{
        let classId = request.query.classId;
        let classDoc = await ClassModel.findById(classId);
        if(classDoc == null){
            return response.status(400).json(`Class with id ${classId} not found`);
        }
        else{
            let regStudents = await Student.find({ "courses": mongoose.Types.ObjectId(classDoc.course)}).exec();
            let res = [];
            for (let student of regStudents) {
                let curAttendace = await Attendance.findOne({ "class": classId , "student": student._id}).exec();
                if(curAttendace == null){
                    res.push({ ...(student.toJSON() as object), isPresent: false})
                }
                else{
                    res.push({ ...(student.toJSON() as object), isPresent: curAttendace.isPresent});
                }
            }
            return response.status(200).json(res);
        }
    }
    catch (err){
        return response.status(500).json({error: err.message});
    }
}

export default {
    getClass,
    postClass,
    getStudentsAttendance,
}