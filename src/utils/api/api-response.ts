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
  constructor(
    protected statusCode: StatusResponse,
    protected json: Object,
    type: string | undefined
  ) {
    if (typeof this.json === "string")
      this.json = { detail: this.json, _type: type };
    // eslint-disable-next-line no-underscore-dangle
    if (typeof this.json === "object") (this.json as any)._type = type;
  }

  send(res: Response) {
    return res.status(this.statusCode).json(this.json);
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(json: Object, type: string) {
    super(StatusResponse.UNAUTHORIZED, json, type);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(json: Object, type: string) {
    super(StatusResponse.NOT_FOUND, json, type);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(json: Object, type: string) {
    super(StatusResponse.FORBIDDEN, json, type);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(json: Object, type: string) {
    super(StatusResponse.BAD_REQUEST, json, type);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(json: Object, type: string) {
    super(StatusResponse.INTERNAL_ERROR, json, type);
  }
}

export class OkResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.OK, json, undefined);
  }
}

export class CreatedResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.CREATED, json, undefined);
  }
}

export class DeletedResponse extends ApiResponse {
  constructor(json: Object) {
    super(StatusResponse.DELETED, json, undefined);
  }
}
