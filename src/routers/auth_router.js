import { Router } from "express";
import { register } from "../controllers/auth_controller.js";
import { login } from "../controllers/auth_controller.js";
import { validateBody } from "../middlewares/validation.js";
import { registerSchema } from "../models/auth.js";
import { loginSchema } from "../models/auth.js";


const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema) ,register);
authRouter.post('/login', validateBody(loginSchema) ,login);

export default authRouter;