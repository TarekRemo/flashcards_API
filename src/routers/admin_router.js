import { Router } from "express";
import { getAllUsers, getUser, deleteUser } from "../controllers/admin_controller.js";
import { authorize } from "../middlewares/authorization.js";

const adminRouter = Router();
adminRouter.use(authorize);

adminRouter.get('/user', getAllUsers);
adminRouter.get('/user/:id', getUser);
adminRouter.delete('/user/:id', deleteUser);

export default adminRouter;