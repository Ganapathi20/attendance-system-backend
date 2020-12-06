import controller from "../controllers/course";
import { Router } from "express";
import authJwt from "../middlewares/authJwt";

const router = Router();

router.get('/studentsAttendance', controller.getStudentAttendance);
router.get('/all', controller.getAllCourses);
router.post('/createCourse', authJwt.verifyToken, authJwt.isTeacher, controller.postCourse, controller.assignTeacherToCourse);
router.post('/registerForCourse', authJwt.verifyToken, authJwt.isStudent, controller.registerForCourse);
router.route('/:id').get(controller.getCourse);
router.route('/').post(controller.postCourse);

export default router;