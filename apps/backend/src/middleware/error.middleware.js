import { ZodError } from "zod";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ZodError || err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: err.errors[0]?.message || "Validation Error",
      data: null,
      errors: err.errors,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    errors: err.errors || [],
  });
};

export default errorMiddleware;