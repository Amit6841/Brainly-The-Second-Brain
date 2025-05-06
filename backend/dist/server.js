"use strict";
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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
(0, db_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
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
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
