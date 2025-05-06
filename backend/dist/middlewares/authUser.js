"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
exports.userAuth = userAuth;
