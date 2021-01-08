import  controller from '../controllers/attendance';
import { Router } from "express";
import multer from "multer";
import path from "path";
import authJwt from '../middlewares/authJwt';
import checkBodyParams from "../middlewares/check-body-params";

const router = Router();
// Set Storage Engine
const storage = multer.diskStorage({
    destination: "public/uploads/",
    filename: function(req, file, cb){
        console.log(process.cwd());
        console.log("filename", file.originalname, );
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 104857600}, // If uploaded file's size greater than 100 MB, displays error
    fileFilter: function(req, file, cb){
        console.log("file filter");
        checkFileType(file, cb);
    }
});

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

router.post('/addOrUpdate', authJwt.verifyToken, authJwt.isTeacher, checkBodyParams("classId", "studentId", "isPresent"),controller.postAttendance);
router.route('/takeAttendanceFromImage').post(upload.single('myImage'),  controller.getStudents);
router.route('/getRollsFromImage').post(upload.single('myImage'),  controller.getRolls);

export default router;