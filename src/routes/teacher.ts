import  controller from '../controllers/teacher';
import { Router } from "express";
import authJwt from '../middlewares/authJwt';
const router = Router();

router.get("/myCourses", authJwt.verifyToken, authJwt.isTeacher , controller.getMyCourses);
router.get('/:id', controller.getTeacher); 
router.route('/').post(controller.postTeacher);

export default router;