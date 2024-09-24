import { Router } from "express";
import { validateDto_Body, validateDto_Query, validateDto_Param } from "../middlewares/validateDto.middleware.js";
import { validateGetAllTask, validateGetTaskById, validateCreateTask, validateUpdateTask, validateDeleteTask } from "../validation/taskValidation.js";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const taskRouter = Router();

taskRouter.use(verifyJWT);

taskRouter.get("/getAllTasks", validateDto_Query(validateGetAllTask), getAllTasks);
taskRouter.get("/getTaskById/:taskId", validateDto_Param(validateGetTaskById), getTaskById);
taskRouter.post("/createTask", validateDto_Body(validateCreateTask), createTask);
taskRouter.post("/updateTask/:taskId", validateDto_Body(validateUpdateTask), updateTask);
taskRouter.get("/deleteTask/:taskId", validateDto_Param(validateDeleteTask), deleteTask);

export default taskRouter;