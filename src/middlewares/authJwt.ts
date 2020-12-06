import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Student from "../models/student";
import Teacher from "../models/teacher";

const verifyToken = async (request: Request, response: Response, next: NextFunction) => {
    let token = request.headers["x-access-token"];

    if (!token) {
        return response.status(403).json({
            msg: "No token provided!"
        });
    }

    jwt.verify(token as string, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return response.status(401).json({
                msg: "Unauthorized!"
            });
        }
        request.userId = (decoded as { id: string }).id;
        next();
    });
}

const isStudent = async (request: Request, response: Response, next: NextFunction) => {
    try{
        const student = await Student.findById(request.userId);
        if(student == null){
            response.status(403).json({msg: "You need to be a student to perform this action"});
        }
        else{
            request.student = student;
            next();
        }
    }
    catch (err) {
        response.status(500).json({error: err.message});
    }
}

const isTeacher = async (request: Request, response: Response, next: NextFunction) => {
    try{
        const teacher = await Teacher.findById(request.userId);
        if(teacher == null){
            response.status(403).json({msg: "You need to be a teacher to perform this action"});
        }
        else{
            request.teacher = teacher;
            next();
        }
    }
    catch (err) {
        response.status(500).json({error: err.message});
    }
}
export default {
    verifyToken,
    isStudent,
    isTeacher,
}