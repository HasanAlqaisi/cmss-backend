import { z } from "zod";

export default () => {
  const zodValidation = z
    .string()
    .refine(
      (value) => {
        const fieldNumber = parseInt(value, 10);
        return !Number.isNaN(fieldNumber);
      },
      { message: "is not a number" }
    )
    .refine(
      (value) => {
        const fieldNumber = parseInt(value, 10);
        return fieldNumber > 0;
      },
      {
        message: "should be greater than 0",
      }
    )
    .transform((value) => Number(value));

  return zodValidation;
};
