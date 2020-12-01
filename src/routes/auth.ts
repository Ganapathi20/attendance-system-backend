import {Router} from "express";
import controller from "../controllers/auth";
import checkBodyParams from "../middlewares/check-body-params";
const router = Router();

const signinParams = ["email", "password"];

router.post("/signup", controller.postSignup);
router.post("/signin", checkBodyParams(...signinParams) ,controller.postSignin);

export default router;
