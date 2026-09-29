import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger-output.json";
import path from "path";
dotenv.config();
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());

app.use(helmet());

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: ["http://localhost:5175", "http://localhost:3000" , "http://192.168.100.48:5175/"],
    credentials: true
  }),
);

app.use(express.json());
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  "/src/uploads/images",
  (req: Request, res: Response, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "src", "uploads", "images")),
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is swimming on PORT ${PORT}`);
});
export default app;
