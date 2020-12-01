// const { response } = require("express");
import {Response, Request} from "express";
import bcrypt from "bcryptjs";
import {MIN_PASS_LEN} from "../constants";
import Student from "../models/student";
import Teacher from "../models/teacher";
import Batch from "../models/batch";
const getStudent = async (request: Request, response:Response)=>{
    try {
        const student = await Student.findById(request.params.id);
        if (student == null) {
            return response.status(404).json({ msg: `Student with id ${request.params.id} doesn't exisit` });
        }
        return response.json(student);
    } 
    catch (err) {
        response.status(500).json({ error: err.message });
    }
    // return response.status(400).json({name: "Pratik Gupta", batch:"Btech 2017 CSE"});
}

const postStudent = async (request: Request, response:Response)=>{
    try{
        let {email, password: password, passwordCheck, firstName, lastName, degree, year, stream} : {email: string, password:string, passwordCheck: string, firstName: string, lastName: string, degree:string, year:number, stream:string}= request.body;
        
        // validation
        if(!email || !password || !passwordCheck || !firstName || !lastName || !degree || !year || !stream){
            return response.status(400).json({msg: "Not all fields are entered"}); 
        }
        if(password.toString().length < MIN_PASS_LEN){
            return response.status(400).json({msg: "Password length should be greater than "+ MIN_PASS_LEN +" characters"});
        }
        if(password !== passwordCheck){
            return response.status(400).json({msg: "Passwords do not match"});
        }

        const existingStudent = await Student.find({email: email});
        if(existingStudent.length>0){
            return response.status(400).json({msg: "User with this email already exists!"});
        }
        const existingTeacher = await Teacher.find({email: email});
        if(existingTeacher.length>0){
            return response.status(400).json({msg: "User with this email already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        // console.log(passwordHash);

        let studentBatch = await Batch.findOne({degree: degree, year: year, stream:stream});
        if(studentBatch === null){
            studentBatch = new Batch({degree:degree, year:year, stream:stream});
            studentBatch.save();
        }
        console.log(studentBatch);

        const newStudent = new Student({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash,
            batch: studentBatch,
        });
        await newStudent.save();
        response.json(newStudent);

    }
    catch (err){
        response.status(500).json({error: err.message});
    }
}

export default {
    getStudent,
    postStudent
}