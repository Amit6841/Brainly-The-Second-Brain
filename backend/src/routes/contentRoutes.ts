import express, { Request, Response, NextFunction } from "express";
import { userAuth } from "../middlewares/authUser";
import {
  createContent,
  getContent,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/contentController";

const contentRouter = express.Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Routes
contentRouter.post("/", userAuth, asyncHandler(createContent));
contentRouter.get("/", userAuth, asyncHandler(getContent));
contentRouter.get("/:id", userAuth, asyncHandler(getContentById));
contentRouter.put("/:id", userAuth, asyncHandler(updateContent));
contentRouter.delete("/:id", userAuth, asyncHandler(deleteContent));

export default contentRouter;
