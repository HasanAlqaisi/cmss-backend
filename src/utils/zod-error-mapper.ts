import { z, ZodIssueCode } from "zod";
import { Request } from "express";
import { translate } from "./i18n";

export default (issue: z.ZodIssueOptionalMessage, ctx: any, req: Request) => {
  let message: string;

  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === "undefined") {
        message = translate(req, "zod.invalid_type.undefined");
      } else {
        message = translate(req, "zod.invalid_type.default", {
          expected: issue.expected,
          received: issue.received,
        });
      }
      break;
    case ZodIssueCode.invalid_enum_value:
      message = translate(req, "z.invalid_enum_value", {
        options: issue.options
          .map((val) => (typeof val === "string" ? `'${val}'` : val))
          .join(" | "),
      });
      break;
    case ZodIssueCode.invalid_arguments:
      message = translate(req, "zod.invalid_arguments");
      break;
    case ZodIssueCode.invalid_return_type:
      message = translate(req, "zod.invalid_return_type");
      break;
    case ZodIssueCode.invalid_date:
      message = translate(req, "zod.invalid_date");
      break;
    case ZodIssueCode.invalid_string:
      if (issue.validation !== "regex")
        message = translate(req, "zod.invalid_string.validation", {
          validation: issue.validation,
        });
      else message = translate(req, "zod.invalid_string.default");
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array" && issue.inclusive)
        message = translate(req, "zod.too_small.array.inclusive", {
          minimum: issue.minimum,
        });
      else if (issue.type === "array" && !issue.inclusive) {
        message = translate(req, "zod.too_small.array.not_inclusive", {
          minimum: issue.minimum,
        });
      } else if (issue.type === "string" && issue.inclusive)
        message = translate(req, "zod.too_small.string.inclusive", {
          minimum: issue.minimum,
        });
      else if (issue.type === "string" && !issue.inclusive) {
        message = translate(req, "zod.too_small.string.not_inclusive", {
          minimum: issue.minimum,
        });
      } else if (issue.type === "number" && issue.inclusive)
        message = translate(req, "zod.too_small.number.inclusive", {
          minimum: issue.minimum,
        });
      else if (issue.type === "number" && !issue.inclusive) {
        message = translate(req, "zod.too_small.number.not_inclusive", {
          minimum: issue.minimum,
        });
      } else message = translate(req, "zod.too_small.default");
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array" && issue.inclusive)
        message = translate(req, "zod.too_big.array.inclusive", {
          minimum: issue.maximum,
        });
      else if (issue.type === "array" && !issue.inclusive) {
        message = translate(req, "zod.too_big.array.not_inclusive", {
          minimum: issue.maximum,
        });
      } else if (issue.type === "string" && issue.inclusive)
        message = translate(req, "zod.too_big.string.inclusive", {
          minimum: issue.maximum,
        });
      else if (issue.type === "string" && !issue.inclusive) {
        message = translate(req, "zod.too_big.string.not_inclusive", {
          minimum: issue.maximum,
        });
      } else if (issue.type === "number" && issue.inclusive)
        message = translate(req, "zod.too_big.number.inclusive", {
          minimum: issue.maximum,
        });
      else if (issue.type === "number" && !issue.inclusive) {
        message = translate(req, "zod.too_big.number.not_inclusive", {
          minimum: issue.maximum,
        });
      } else message = translate(req, "zod.too_big.default");
      break;
    case ZodIssueCode.custom:
      message = translate(req, "zod.custom");
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = translate(req, "zod.invalid_intersection_types");
      break;
    case ZodIssueCode.not_multiple_of:
      message = translate(req, "zod.not_multiple_of", {
        multipleOf: issue.multipleOf,
      });
      break;
    default:
      message = ctx.defaultError;
  }
  return { message };
};
