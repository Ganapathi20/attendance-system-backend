import controller from "../controllers/course";
import { Router } from "express";

const router = Router();

router.route('/:id').get(controller.getCourse);
router.route('/').post(controller.postCourse);

export default router;