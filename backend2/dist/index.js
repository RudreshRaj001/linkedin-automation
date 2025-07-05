"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const geminiRoutes_1 = __importDefault(require("./routes/geminiRoutes"));
const linkedinRoutes_1 = __importDefault(require("./routes/linkedinRoutes"));
// Load environment variables from .env file
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// Middleware
app.use((0, cors_1.default)()); // Allow all CORS requests for development. Refine for production.
app.use(express_1.default.json()); // Enable parsing of JSON request bodies
// API Routes
app.use('/api/gemini', geminiRoutes_1.default);
app.use('/api/linkedin', linkedinRoutes_1.default);
// Simple root route
app.get('/', (req, res) => {
    res.send('LinkedIn Automation Backend is running!');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access backend at http://localhost:${PORT}`);
});
