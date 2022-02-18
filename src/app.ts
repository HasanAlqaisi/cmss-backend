import express, { Application } from "express";
import morgan from "morgan";
import passport from "passport";
import { NotFoundError } from "./utils/api/api-error";
import jwtConfig from "./utils/auth/jwt";
import logger from "./utils/config/logger";
import "./utils/config/general";
import mainErrorHandler from "./utils/main-error-handler";
import mainRoute from "./index";

const app: Application = express();

app.use(express.json());

app.listen(3000, () => {
  logger.debug("Server running at port 3000");
});

// Log http requests info
app.use(morgan("dev"));

// Configure passport for auth
app.use(passport.initialize());
jwtConfig(passport);

// Main app route
app.use("/", mainRoute);

// For unknown route
app.use((_req, _res, next) => next(new NotFoundError()));

// Handle errors
app.use(mainErrorHandler);
