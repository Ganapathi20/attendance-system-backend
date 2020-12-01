import mongoose from "mongoose";
import { Response, Request } from "express";
import Course from "../models/course";

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

const postCourse = async (request: Request, response: Response) => {
    try{

        let {name, year, semester}: {name: string, year:number, semester: string} = request.body;
        // TODO insert check on the year
        if(!name || !year || !semester){
            return response.status(400).json({msg: "Not all fields are entered"}); 
        }
        if(!(["Autumn", "Spring", "autumn", "spring"].includes(semester))){
            return response.status(422).json({msg: "Semester has to either Autumn or Spring"});
        }
        
        let oldCourse = await Course.findOne({name: name, year: year, semester: semester});
        if(oldCourse !== null){
            return response.status(400).json({msg: `Course with id given details is already present`});
        }
        
        let newCourse = new Course({
            name: name,
            year: year,
            semester: semester
        });
        
        newCourse.save();
        return response.json(newCourse);
    }
    catch(err){
        response.status(500).json({error: err.message});
    }

}

export default {
    getCourse,
    postCourse
}