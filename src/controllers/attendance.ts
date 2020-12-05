import { Request, Response } from "express";
import Attendance from "../models/attendance";

const spawn = require('child_process').spawn
import multer from "multer";
import path from "path";

// Set Storage Engine
const storage = multer.diskStorage({
    destination: "public/uploads/",
    filename: function(req, file, cb){
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 2000000}, // If uploaded file's size greater than 2x10^6 bytes, displays error
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single("myImage");

// Check File Type
function checkFileType(file: any, cb: any){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|heic|application|octet-stream/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true); // Return null as the error
    }
    else{
        cb("Error: Images only!");
    }
}

const getStudents = async (request: Request, response: Response) => {
    try{
        // console.log("called controller")
        upload(request, response, () => {
            if(request.file == undefined){
                // console.log(request);
                // console.log(request.file);
                return response.status(400).json({msg: "Error: No File Selected!"});
            }
            // console.log("upload function called", request.file.filename);
            const process = spawn('python', ["face_recog/scripts/attendance.py", request.file.filename]);
            process.stdout.on('data', function(data: any){
                const rolls = data.toString().split('-');
                for(let i=0; i < Object.keys(rolls).length-1; i++) {
                    let roll = rolls[i];
                }                  
                response.send(data.toString());
            });
        }
    )}
    catch (err) {
        response.status(500).json({ error: err.message });
    }
}

export default {
    getStudents
}
