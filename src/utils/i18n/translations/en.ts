export default {
  zod: {
    invalid_type: {
      undefined: "Required",
      default: "should get expected, but got received",
    },
    invalid_enum_value: "Invalid enum value. Expected options",
    invalid_arguments: "Invalid function arguments",
    invalid_return_type: "Invalid function return type",
    invalid_date: "Invalid date",
    invalid_string: {
      validation: "Invalid validation",
      default: "Invalid",
    },
    too_small: {
      array: {
        inclusive: "Array must contain at least minimum elements",
        not_inclusive: "Array must contain more than minimum elements",
      },
      string: {
        inclusive: "String must contain at least minimum chars",
        not_inclusive: "String must contain more than minimum chars",
      },
      number: {
        inclusive: "Number must be greater than or equal minimum",
        not_inclusive: "Number must be greater than minimum",
      },
      default: "Invalid input",
    },
    too_big: {
      array: {
        inclusive: "Array must contain at most maximum elements",
        not_inclusive: "Array must contain less than maximum elements",
      },
      string: {
        inclusive: "String must contain at most maximum chars",
        not_inclusive: "String must contain less than maximum chars",
      },
      number: {
        inclusive: "Number must be less than or equal maximum",
        not_inclusive: "Number must be less than maximum",
      },
      default: "Invalid input",
    },
    custom: "Invalid input",
    invalid_intersection_types: "Intersection results could not be merged",
    not_multiple_of: "Number must be a multiple of multipleOf",
  },

  loginFailed: "Unable to login with the provided credentials",

  serverError: "Something went wrong",
};
