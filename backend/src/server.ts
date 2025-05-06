import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes";
import contentRouter from "./routes/contentRoutes";
import shareRouter from "./routes/shareRoutes";
import connectDB from "./config/db"
import dotenv from "dotenv";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

connectDB()

// Middleware

app.use(express.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(cookieParser())
app.use(cors({ origin:"http://localhost:5173", credentials: true }));


app.use("/api/user", userRouter);
app.use("/api/content", contentRouter);
app.use("/api/brain", shareRouter);

// Default route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Brainly API!");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});