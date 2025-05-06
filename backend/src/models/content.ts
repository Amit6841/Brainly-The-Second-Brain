import mongoose, { Schema, Document, Model } from "mongoose";

interface Content extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  link: string;
  type: string;
  tags: string[];
  content:string
}

const contentSchema = new Schema<Content>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    link: { type: String},
    type: { type: String, required: true },
    tags: [{ type: String }],
    content: { type: String }
  },
  { timestamps: true }
);

const ContentModel: Model<Content> = mongoose.model<Content>("Content", contentSchema);

export default ContentModel;