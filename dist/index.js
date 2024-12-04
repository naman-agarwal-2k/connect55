"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("./config/index");
const router_1 = require("./routes/router");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.set("port", index_1.config.port);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// app.use(cookieParser());
app.use((0, cors_1.default)({
    origin: "*", // Consider restricting this in production
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
}));
// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Server UP" });
});
mongoose_1.default
    .connect("mongodb+srv://naman2:namanagarwal@connect55.iuhn8.mongodb.net/?retryWrites=true&w=majority&appName=connect55")
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('MongoDB connection error:', error));
(0, router_1.registerRoutes)(app);
//Uncaught Exception Handling
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.stack);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
});
// Default Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
//Create and start HTTP Server
const httpsServer = http_1.default.createServer(app);
httpsServer.listen(app.get("port"), () => {
    console.log("Express server listening on port" + app.get("port"));
});
exports.default = app;
