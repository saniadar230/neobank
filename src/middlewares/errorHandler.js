// Implemeted RFC
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const detail = err.detail || "Something went wrong!";
  const title = err.title || "Internal Server Error";
  const instance = req.originalUrl;
  const errors = err.errors || [];

  if (err.isOperational) {
    return res
      .status(statusCode)
      .set("Content-Type", "application/problem+json")
      .json({
        type: "about:blank",
        detail,
        status: statusCode,
        instance,
        title,
        // if errors array has errors, only then add it in response
        // spreading false into an object = adding nothing
        ...(errors?.length > 0 && { errors }),
      });
  }

  console.error(err);

  return res.status(500).set("Content-Type", "application/problem+json").json({
    // empty for now since I don't have error documentation
    type: "about:blank",
    title: "Internal Server Error",
    status: 500,
    detail: "Something went wrong",
    instance: req.originalUrl,
  });
};
