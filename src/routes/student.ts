import  controller from '../controllers/student';
import { Router } from "express";
const router = Router();

router.get('/:id', controller.getStudent); 
router.route('/').post(controller.postStudent)

export default router;