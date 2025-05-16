"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authUser_1 = require("../middlewares/authUser");
const contentController_1 = require("../controllers/contentController");
const contentRouter = express_1.default.Router();
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
// Routes
contentRouter.post("/", authUser_1.userAuth, asyncHandler(contentController_1.createContent));
contentRouter.get("/", authUser_1.userAuth, asyncHandler(contentController_1.getContent));
contentRouter.get("/:id", authUser_1.userAuth, asyncHandler(contentController_1.getContentById));
contentRouter.put("/:id", authUser_1.userAuth, asyncHandler(contentController_1.updateContent));
contentRouter.delete("/:id", authUser_1.userAuth, asyncHandler(contentController_1.deleteContent));
exports.default = contentRouter;
//# sourceMappingURL=contentRoutes.js.map