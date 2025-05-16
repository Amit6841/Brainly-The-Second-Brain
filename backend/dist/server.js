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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const contentRoutes_1 = __importDefault(require("./routes/contentRoutes"));
const shareRoutes_1 = __importDefault(require("./routes/shareRoutes"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Port = process.env.PORT;
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cookie_parser_1.default)());
// CORS configuration
const allowOrigin = ["https://brainly-the-second-brain-client.vercel.app"];
// Enable CORS for all routes
app.use((0, cors_1.default)({
    origin: allowOrigin,
    credentials: true,
}));
// Routes
app.use("/api/user", userRoutes_1.default);
app.use("/api/content", contentRoutes_1.default);
app.use("/api/brain", shareRoutes_1.default);
// Default route
app.get("/", (req, res) => {
    res.send("Welcome to the Brainly API!");
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});
// Connect to MongoDB and start server only in development
if (process.env.NODE_ENV !== 'production') {
    (0, db_1.default)()
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
}
else {
    // In production (serverless), connect to MongoDB for each request
    app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)();
            next();
        }
        catch (error) {
            console.error('Database connection error:', error);
            res.status(500).json({ message: 'Database connection error' });
        }
    }));
}
exports.default = app;
//# sourceMappingURL=server.js.map