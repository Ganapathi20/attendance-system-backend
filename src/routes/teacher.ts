import  controller from '../controllers/teacher';
import { Router } from "express";
const router = Router();

router.get('/:id', controller.getTeacher); 
router.route('/').post(controller.postTeacher);

export default router;