import { Response } from "express";
import {
  AuthFailureResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
} from "./api-response";

enum ErrorType {
  BAD_TOKEN = "BadTokenError",
  BAD_REQUEST = "BadRequestError",
  NOT_FOUND = "NotFoundError",
  FORBIDDEN = "ForbiddenError",
  INTERNAL = "InternalError",
}

export abstract class ApiError extends Error {
  constructor(public type: ErrorType, public message: string = "Error") {
    super(message);
  }

  public static handle(err: ApiError, res: Response): Response {
    switch (err.type) {
      case ErrorType.BAD_TOKEN:
        return new AuthFailureResponse(err.message).send(res);
      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message).send(res);
      case ErrorType.NOT_FOUND:
        return new NotFoundResponse(err.message).send(res);
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res);
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res);
      default: {
        let { message } = err;
        if (process.env.NODE_ENV === "production")
          message = "Something wrong happened.";

        return new InternalErrorResponse(message).send(res);
      }
    }
  }
}

export class BadTokenError extends ApiError {
  constructor(message: any = "Authentication Failure") {
    super(ErrorType.BAD_TOKEN, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: any = "Bad Parameters") {
    super(ErrorType.BAD_REQUEST, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: any = "Not Found") {
    super(ErrorType.NOT_FOUND, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: any = "Forbidden") {
    super(ErrorType.FORBIDDEN, message);
  }
}

export class InternalError extends ApiError {
  constructor(message: any = "Internal Error") {
    super(ErrorType.INTERNAL, message);
  }
}
