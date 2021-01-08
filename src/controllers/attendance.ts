import { Request, Response } from "express";
import { readdirSync } from "fs";
import Attendance from "../models/attendance";
import Student, { IStudent } from "../models/student";

const spawn = require('child_process').spawn

const getStudents = async (request: Request, response: Response) => {
    try {
        // console.log("called controller")
        if (!request.body.classId) {
            return response.status(400).json({ msg: `classId param is needed in body` });
        }
        console.log(request.file, request.myImage);
        if (request.file == undefined) {
            // console.log(request);
            // console.log(request.file);
            return response.status(400).json({ msg: "Error: No File Selected!" });
        }
        // console.log("upload function called", request.file.filename);
        const process = spawn('python', ["face_recog/scripts/attendance.py", request.file.filename]);
        process.stdout.on('data', async function (data: any) {
            let rolls: string[] = data.toString().split('-');
            rolls.splice(rolls.length - 1, 1);
            // for(let i=0; i < Object.keys(rolls).length-1; i++) {
            //     let roll = rolls[i];
            // }                  
            // response.status(200).json(rolls);
            const options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
            let res: IStudent[] = [];
            for (let roll of rolls) {
                let curStudent = await Student.findOne({ roll: roll });
                if (curStudent != null) {
                    // let curAtt = await Attendance.findOneAndUpdate({"class": request.body.classId, student: curStudent._id},{"class": request.body.classId, student: curStudent._id, isPresent: true}, options );
                    let curAtt = new Attendance({ "class": request.body.classId, student: curStudent._id, isPresent: true });
                    try {
                        await curAtt.save();
                        res.push(curStudent);
                    }
                    catch (err) {
                        console.log("attendance error", err);
                    }
                    // console.log(curAtt);
                }
            }
            return response.status(200).json(res);
        });

    }
    catch (err) {
        return response.status(500).json({ error: err.message });
    }
}

const getRolls = async (request: Request, response: Response) => {
    try {
        console.log(request.file, request.myImage);
        if (request.file == undefined) {
            // console.log(request);
            // console.log(request.file);
            return response.status(400).json({ msg: "Error: No File Selected!" });
        }
        // console.log("upload function called", request.file.filename);
        const process = spawn('python', ["face_recog/scripts/attendance.py", request.file.filename]);
        process.stdout.on('data', async function (data: any) {
            let rolls: string[] = data.toString().split('-');
            rolls.splice(rolls.length - 1, 1);        
            response.status(200).json(rolls);
        });
    }
    catch (err){
        return response.status(500).json({error: err.message});
    }
}

const postAttendance = async (request: Request, response: Response) => {
    try {
        const options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
        const oldAttData = {
            "class": request.body.classId,
            "student": request.body.studentId,
        }
        const newAttData = {
            "class": request.body.classId,
            "student": request.body.studentId,
            isPresent: request.body.isPresent,
        }
        let updatedAtt = await Attendance.findOneAndUpdate(oldAttData, newAttData, options);
        console.log("postAttendance", updatedAtt);
        response.status(200).json(updatedAtt);
    }
    catch (err) {
        return response.status(500).json({ error: err.message });
    }
}

export default {
    getStudents,
    postAttendance,
    getRolls,
}

// 17100020-17100027-17100029-17100029-17100025
// 17100025-17100027-17100030-17100020-
// Images to show
// 22 - meenakshi and sindhu  (final)
// 26 - meenkashi and loveleen (cancel) (wrong-nilanjana)
// 28 - meenkashi and loveleen, rasheed, sindhu
// 16- meenkashi and loveleen
