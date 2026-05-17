import { ValidationError } from "../utils/AppError.js";

const VALID_TYPES = ["body", "params", "query", "cookies"];

export const validate = (schema, type) => {
  if (!VALID_TYPES.includes(type))
    throw new Error(`Validation type is invalid: ${type} `);

  return (req, res, next) => {
    const { error, value } = schema.validate(req[type], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      throw new ValidationError("One or more fields are invalid", errorDetails);
    }

    next();
  };
};
