import { Request, Response } from "express";
import ContentModel from "../models/content";
import UserModel from "../models/user";

export const createContent = async (req: Request, res: Response) => {
    try {
        const { title, link, type, tags, content } = req.body;
        const userId = req.userId;

        if(!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing." });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found.",
            });
        }

        const newContent = await ContentModel.create({
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
        })
        
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

export const getContent = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing." });
        }

        const contentList = await ContentModel.find({ userId }).populate("userId", "email");

        if (!contentList.length) {
            return res.status(200).json({
                message: "No content found.",
                data: [],
            });
        }

        res.status(200).json({
            message: "Content fetched successfully.",
            data: contentList,
        })

    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
            message: "Server error: " + error.message,
        });
    }
};

export const getContentById = async (req: Request, res: Response) => {
    try {
        const contentId = req.params.id;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing." });
        }

        const content = await ContentModel.findOne({ _id: contentId, userId });

        if (!content) {
            return res.status(404).json({
                message: "Content not found.",
            });
        }

        res.status(200).json({
            message: "Content fetched successfully.",
            data: content,
        })

    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
            message: "Server error: " + error.message,
        });
    }
};

// Update content
export const updateContent = async (req: Request, res: Response) => {
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

        const updatedContent = await ContentModel.findOneAndUpdate(
            { _id: contentId, userId }, // Ensure content belongs to user
            updateData,
            { 
                new: true,
                runValidators: true // Run model validations
            }
        );

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

    } catch (error: any) {
        console.error("Update content error:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update content: " + error.message 
        });
    }
};

// Delete content
export const deleteContent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await ContentModel.findByIdAndDelete(id);
        res.status(201).json({success:true, message: "Content deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete content" });
      }
};
