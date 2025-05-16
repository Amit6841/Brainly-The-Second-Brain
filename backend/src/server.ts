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
const Port = process.env.PORT;
const app = express();

// Middleware
app.use(express.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(cookieParser())

// CORS configuration
const allowOrigin= ["https://brainly-the-second-brain-client.vercel.app"]

// Enable CORS for all routes
app.use(cors({
    origin: allowedOrigin ,
    credentials: true,
}));

// Routes
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

// Connect to MongoDB and start server only in development
if (process.env.NODE_ENV !== 'production') {
    connectDB()
        .then(() => {
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Failed to connect to MongoDB:', error);
            process.exit(1);
        });
} else {
    // In production (serverless), connect to MongoDB for each request
    app.use(async (req: Request, res: Response, next: NextFunction) => {
        try {
            await connectDB();
            next();
        } catch (error) {
            console.error('Database connection error:', error);
            res.status(500).json({ message: 'Database connection error' });
        }
    });
}

export default app;
