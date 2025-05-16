"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.getContentById = exports.getContent = exports.createContent = void 0;
const content_1 = __importDefault(require("../models/content"));
const user_1 = __importDefault(require("../models/user"));
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, link, type, tags, content } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing." });
        }
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found.",
            });
        }
        const newContent = yield content_1.default.create({
            userId,
            title,
            link,
            type,
            tags,
            content,
        });
        res.status(201).json({
            message: "Content created successfully.",
            data: newContent,
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
});
exports.createContent = createContent;
const getContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing." });
        }
        const contentList = yield content_1.default.find({ userId }).populate("userId", "email");
        if (!contentList.length) {
            return res.status(200).json({
                message: "No content found.",
                data: [],
            });
        }
        res.status(200).json({
            message: "Content fetched successfully.",
            data: contentList,
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Server error: " + error.message,
        });
    }
});
exports.getContent = getContent;
const getContentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentId = req.params.id;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing." });
        }
        const content = yield content_1.default.findOne({ _id: contentId, userId });
        if (!content) {
            return res.status(404).json({
                message: "Content not found.",
            });
        }
        res.status(200).json({
            message: "Content fetched successfully.",
            data: content,
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Server error: " + error.message,
        });
    }
});
exports.getContentById = getContentById;
// Update content
const updateContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentId = req.params.id;
        const userId = req.userId; // Get userId from request object, set by auth middleware
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID is missing."
            });
        }
        const { title, link, type, tags } = req.body;
        const updateData = {
            title,
            link,
            type,
            tags: tags || [],
            updatedAt: new Date()
        };
        const updatedContent = yield content_1.default.findOneAndUpdate({ _id: contentId, userId }, // Ensure content belongs to user
        updateData, {
            new: true,
            runValidators: true // Run model validations
        });
        if (!updatedContent) {
            return res.status(404).json({
                success: false,
                message: "Content not found or unauthorized."
            });
        }
        res.status(200).json({
            success: true,
            message: "Content updated successfully.",
            data: updatedContent
        });
    }
    catch (error) {
        console.error("Update content error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update content: " + error.message
        });
    }
});
exports.updateContent = updateContent;
// Delete content
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield content_1.default.findByIdAndDelete(id);
        res.status(201).json({ success: true, message: "Content deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete content" });
    }
});
exports.deleteContent = deleteContent;
//# sourceMappingURL=contentController.js.map