import { ResolveOptions } from "dns";
import { Request, Response } from "express";
import { resolve } from "path";
import { clearScreenDown } from "readline";
import Course from "../models/course";
import Class, { IClass } from "../models/class";

const getClass = async (request: Request, response: Response) => {
    try {
        const classInstance = await Class.findOne({ "_id": request.params.id }).populate('course');
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
    let {topic, courseId, hour, minute, date, month, year} : {topic: string, courseId: string, hour: number, minute: number, date: number, month: number, year: number} =  request.body;
    if(!topic || !courseId || !hour || !minute || !date || !month || !year){
        response.status(400).json({msg: `Not all fields are entered`});
    }
    let curDate = new Date(year, month, date, hour, minute);
    let course = await Course.findById(courseId);
    if(course === null){
        response.status(404).json({msg: `Course with id ${courseId} doesn't exist`})
    }
    let newClass = new Class({
        topic: topic,
        time: curDate,
        course: course?._id
    });

    return response.json(newClass);
}

export default {
    getClass,
    postClass,
}