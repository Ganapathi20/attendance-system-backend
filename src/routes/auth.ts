import {Router} from "express";
import controller from "../controllers/auth";
const router = Router();

router.post("/signup", controller.postSignup);
router.post("/signin", controller.postSignup);

export default router;
