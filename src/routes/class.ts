import  controller from '../controllers/class';
import { Router } from "express";
const router = Router();

router.get('/:id', controller.getClass); 
router.route('/').post(controller.postClass);

export default router;