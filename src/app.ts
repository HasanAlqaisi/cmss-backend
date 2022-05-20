import express, { Application } from "express";
import morgan from "morgan";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { NotFoundError } from "./utils/api/api-error";
import jwtConfig from "./utils/auth/jwt";
import logger from "./utils/config/logger";
import "./utils/config/general";
import mainErrorHandler from "./utils/main-error-handler";
import mainRoute from "./index";
import specs from "../openapi.json";
import setZodErrors from "./middlewares/set-zod-errors";

const json2xls = require("json2xls");

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Convert JSON to XLS
app.use(json2xls.middleware);

app.use(cookieParser());

// Log http requests info
app.use(morgan("dev"));

// Configure passport for auth
app.use(passport.initialize());
jwtConfig(passport);

if (process.env.NODE_ENV === "development") {
  app.use("/docs", swaggerUi.serve);
  app.get("/docs", swaggerUi.setup(specs));
}

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(setZodErrors);

app.get("/xls", (req, res) => {
  (res as any).xls("schedule.xlsx", req.body);
});

// Main app route
app.use("/", mainRoute);

// For unknown route
app.use((_req, _res, next) => next(new NotFoundError()));

// Handle errors
app.use(mainErrorHandler);

app.listen(process.env.PORT, () => {
  logger.debug(
    `Application running checkout http://localhost:${process.env.PORT}/docs`
  );
});
