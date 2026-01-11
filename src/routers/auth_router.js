import { Router } from "express";
import { register, login, getProfile } from "../controllers/auth_controller.js";
import { validateBody } from "../middlewares/validation.js";
import { registerSchema, loginSchema } from "../models/auth.js";
import { authorize } from "../middlewares/authorization.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema) ,register);
authRouter.post('/login', validateBody(loginSchema) ,login);

authRouter.get('/me', authorize, getProfile);

export default authRouter;