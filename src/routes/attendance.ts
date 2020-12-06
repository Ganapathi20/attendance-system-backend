import  controller from '../controllers/attendance';
import { Router } from "express";
const router = Router();

router.route('/takeAttendanceFromImage').get(controller.getStudents);

export default router;