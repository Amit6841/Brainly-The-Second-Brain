import express from "express";
import { userAuth } from "../middlewares/authUser";
import { shareBrain, fetchSharedBrain } from "../controllers/shareController";

const asyncHandler = (
  fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>
) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

const shareRouter = express.Router();

shareRouter.post("/share", userAuth, asyncHandler(shareBrain));
shareRouter.get("/share/:hash", asyncHandler(fetchSharedBrain));

export default shareRouter;