import express, { Application } from "express";
import morgan from "morgan";
import passport from "passport";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { NotFoundError } from "./utils/api/api-error";
import jwtConfig from "./utils/auth/jwt";
import logger from "./utils/config/logger";
import "./utils/config/general";
import mainErrorHandler from "./utils/main-error-handler";
import mainRoute from "./index";
import specs from "../openapi.json";
import prisma from "./prisma";


const app: Application = express();

app.use(cors());

app.use(express.json());

app.listen(process.env.PORT, () => {
  logger.debug(`Server running at port ${process.env.PORT}`);
});

// Log http requests info
app.use(morgan("dev"));

// Configure passport for auth
app.use(passport.initialize());
jwtConfig(passport);

if (process.env.NODE_ENV === "development") {
  app.use("/docs", swaggerUi.serve);
  app.get("/docs", swaggerUi.setup(specs));
}

// prisma.$use(async (params, next) => {
//   if (params.model === "Applicant" && params.action === "create") {
//     const result = await next(params);
//     logger.debug(`result is ${result}`);
//   }
// });
// Main app route
app.use("/", mainRoute);

// For unknown route
app.use((_req, _res, next) => next(new NotFoundError()));

// Handle errors
app.use(mainErrorHandler);
