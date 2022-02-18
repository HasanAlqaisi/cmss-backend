import { Response } from "express";

enum StatusResponse {
  OK = 200,
  CREATED = 201,
  DELETED = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

abstract class ApiResponse {
  constructor(protected statusCode: StatusResponse, protected json: Object) {
    if (typeof this.json === "string") this.json = { details: this.json };
  }

  send(res: Response) {
    return res.status(this.statusCode).json(this.json);
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.UNAUTHORIZED, json);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.NOT_FOUND, json);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.FORBIDDEN, json);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.BAD_REQUEST, json);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.INTERNAL_ERROR, json);
  }
}

export class OkResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.OK, json);
  }
}

export class CreatedResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.CREATED, json);
  }
}

export class DeletedResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.DELETED, json);
  }
}
