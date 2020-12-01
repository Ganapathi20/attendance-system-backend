import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Student, { IStudent } from "../models/student";
import Teacher, { ITeacher } from "../models/teacher";
import jwt from "jsonwebtoken";
const postSignup = async (request: Request, response: Response) => {
    try {
        const { role }: { role: string } = request.body;
        if (!role) {
            response.status(400).json({msg: "'role' is necessary for signup"});
        }
        if(role.toLowerCase() ==="student"){
            response.redirect(307, '/api/student');
        }
        else if(role.toLowerCase() === "teacher"){
            response.redirect(307, '/api/teacher');
        }
        else{
            response.status(400).json({msg: "role can be either student or teacher"});
        }
    }
    catch (err) {
        response.status(500).json({ error: err.message });
    }
}

const postSignin = async (request: Request, response: Response) => {
    const {email, password}:{email:string, password:string} = request.body;
    let user : IStudent | ITeacher | null = null;
    let token : string = "";
    let role : "student"|"teacher";
    user = await Student.findOne({"email": email});
    if(user!==null){
        role = "student";
        token = jwt.sign({ id: user.id, role:role }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });
    }
    else{
        user = await Teacher.findOne({"email": email});
        if(user!==null){
            role = "teacher";
            token = jwt.sign({ id: user.id, role:role }, process.env.JWT_SECRET, {
                expiresIn: 86400 // 24 hours
            });
        }
        else{
            return response.status(404).json({msg: `No user with email ${email} exists`});
        }
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if(!isPasswordValid){
        return response.status(401).json({msg: "Invalid password!"});
    }
    return response.json({accessToken: token, role: role});
}

export default {
    postSignin,
    postSignup,
}