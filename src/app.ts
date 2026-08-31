import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger-output.json";
import path from "path";
dotenv.config();
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  "/uploads/images",
  express.static(path.join(process.cwd(), "src", "uploads", "images")),
);

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server is swimming on PORT ${PORT}`);
});
export default app;
