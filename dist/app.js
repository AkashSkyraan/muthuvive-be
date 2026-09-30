"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./docs/swagger-output.json"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
// const allowedOrigins = [
//   "http://localhost:5175",
//   "http://localhost:3000",
//   "http://127.0.0.1:5175",
//   "http://192.168.100.48:5175",
//   "https://muthuvives.skyraantech.com"
// ];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
app.use(express_1.default.json());
app.use(express_1.default.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    },
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", routes_1.default);
app.use((0, morgan_1.default)("dev"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.use("/src/uploads/images", (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express_1.default.static(path_1.default.join(process.cwd(), "src", "uploads", "images")));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is swimming on PORT ${PORT}`);
});
exports.default = app;
