import  controller from '../controllers/student';
import { Router } from "express";
import authJwt from "../middlewares/authJwt";
const router = Router();

router.get("/unregCourses", authJwt.verifyToken, authJwt.isStudent, controller.getUnregCourses);
router.get("/myCourses", [authJwt.verifyToken, authJwt.isStudent],controller.getMyCourses);
router.get('/:id', controller.getStudent); 
router.route('/').post(controller.postStudent);

export default router;