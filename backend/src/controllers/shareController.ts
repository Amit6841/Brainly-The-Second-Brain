import { Request, Response } from "express";
import ContentModel from "../models/content";

export const shareBrain = async (req: Request, res: Response) => {
    try {
        const userId = req.userId; // Extract userId from middleware (ensure user is authenticated)

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not logged in" });
        }

        // Fetch all content for the user
        const userContent = await ContentModel.find({ userId });

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
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

export const fetchSharedBrain = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error("Error fetching shared content:", error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};