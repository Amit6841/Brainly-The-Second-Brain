import express from "express";
import { signup,login,logout } from "../controllers/userController";

const userRouter = express.Router();

const asyncHandler = (fn: any) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

userRouter.post('/signup', asyncHandler(signup));
userRouter.post('/login', asyncHandler(login));
userRouter.get('/logout', asyncHandler(logout));

export default userRouter;