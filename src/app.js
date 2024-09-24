import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";

const app = express();

app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => res.status(200).json({Message: "Hi!"}));

export default app;