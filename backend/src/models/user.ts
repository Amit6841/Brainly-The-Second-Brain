import mongoose, { Schema, Document, Model } from "mongoose";

interface User extends Document {
    name: string
    email: string;
    password: string;
}

const userSchema = new Schema<User>(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

const UserModel: Model<User> = mongoose.model<User>("User", userSchema);

export default UserModel;