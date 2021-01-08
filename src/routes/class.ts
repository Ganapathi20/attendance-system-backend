import  controller from '../controllers/class';
import { Router } from "express";
import authJwt from '../middlewares/authJwt';
const router = Router();

router.get("/studentsAttendance", controller.getStudentsAttendance);
router.get('/:id', controller.getClass); 
router.route('/').post(authJwt.verifyToken, authJwt.isTeacher, controller.postClass);

export default router;