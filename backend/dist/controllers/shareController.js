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
exports.fetchSharedBrain = exports.shareBrain = void 0;
const content_1 = __importDefault(require("../models/content"));
const shareBrain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId; // Extract userId from middleware (ensure user is authenticated)
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }
        // Fetch all content for the user
        const userContent = yield content_1.default.find({ userId });
        if (!userContent || userContent.length === 0) {
            return res.status(404).json({ message: "No content found to share" });
        }
        // Generate a shareable link or token (for simplicity, we'll use a unique ID)
        const shareToken = Math.random().toString(36).substring(2, 15); // Generate a random token
        // Save the shareable link or token in the database (optional)
        // You can create a separate ShareModel to store shared links if needed
        res.status(200).json({
            success: true,
            message: "Brain shared successfully",
            shareToken,
            content: userContent, // Optionally include the content in the response
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
});
exports.shareBrain = shareBrain;
const fetchSharedBrain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hash } = req.params;
        if (!hash) {
            return res.status(400).json({ message: "Hash is required." });
        }
        const sharedContent = {
            hash,
            content: "Example shared content",
        };
        res.status(200).json({
            message: "Shared content fetched successfully.",
            data: sharedContent,
        });
    }
    catch (error) {
        console.error("Error fetching shared content:", error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
});
exports.fetchSharedBrain = fetchSharedBrain;
//# sourceMappingURL=shareController.js.map