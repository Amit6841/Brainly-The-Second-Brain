import mongoose, { Document, Schema, Model } from "mongoose";

interface ShareBrain extends Document {
    hash: string;
    userId: Schema.Types.ObjectId;
}

const shareBrainSchema = new Schema<ShareBrain>(
    {
        hash: { type: String, unique: true, required: true },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

const ShareBrainModel: Model<ShareBrain> = mongoose.model<ShareBrain>("ShareBrain", shareBrainSchema);

export default ShareBrainModel;