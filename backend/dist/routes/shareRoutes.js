"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authUser_1 = require("../middlewares/authUser");
const shareController_1 = require("../controllers/shareController");
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
const shareRouter = express_1.default.Router();
shareRouter.post("/share", authUser_1.userAuth, asyncHandler(shareController_1.shareBrain));
shareRouter.get("/share/:hash", asyncHandler(shareController_1.fetchSharedBrain));
exports.default = shareRouter;
