export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
