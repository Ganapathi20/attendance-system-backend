import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import { MIN_PASS_LEN } from "../constants";
import Teacher from "../models/teacher";
import Student from "../models/student";

const getTeacher = async (request: Request, response: Response) => {
    try {
        const teacher = await Teacher.findById(request.params.id);
        if (teacher == null) {
            return response.status(404).json({ msg: `Teacher with id ${request.params.id} doesn't exisit` });
        }
        return response.json(teacher);
    } 
    catch (err) {
        response.status(500).json({ error: err.message });
    }
}

const postTeacher = async (request: Request, response: Response) => {
    try {
        let { email, password: password, passwordCheck, firstName, lastName, }: { email: string, password: string, passwordCheck: string, firstName: string, lastName: string, } = request.body;

        // validation
        if (!email || !password || !passwordCheck || !firstName || !lastName) {
            return response.status(400).json({ msg: "Not all fields are entered" });
        }
        if (password.toString().length < MIN_PASS_LEN) {
            return response.status(400).json({ msg: "Password length should be greater than " + MIN_PASS_LEN + " characters" });
        }
        if (password !== passwordCheck) {
            return response.status(400).json({ msg: "Passwords do not match" });
        }

        const existingTeachers = await Teacher.find({ email: email });
        if (existingTeachers.length > 0) {
            return response.status(400).json({ msg: "User with this email already exists!" });
        }
        const existingStudents = await Student.find({email: email});
        if(existingStudents.length > 0){
            return response.status(400).json({ msg: "User with this email already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        // console.log(passwordHash);

        const newTeacher = new Teacher({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash,
        });
        newTeacher.save();
        response.json(newTeacher);

    }
    catch (err) {
        response.status(500).json({ error: err.message });
    }
}

export default {
    getTeacher,
    postTeacher,
}