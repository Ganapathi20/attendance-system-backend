import { ResolveOptions } from "dns";
import { Request, Response } from "express";
import { resolve } from "path";
import { clearScreenDown } from "readline";
import Course from "../models/course";
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
        if(!topic || !courseId || !hour || !minute || !date ){
            // console.log(topic, courseId, hour, minute, date);
            response.status(400).json({msg: `Not all fields are entered`});
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
            response.status(404).json({msg: `Course with id ${courseId} doesn't exist`})
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
        response.status(500).json({error: err.message});
    }
}

export default {
    getClass,
    postClass,
}