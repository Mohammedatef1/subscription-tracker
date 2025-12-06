const errorMiddleware = (err, req, res, next) => {
  try {
    const error = { ...err };

    error.message = err.message;

    console.log(err);

    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    if (err.code === 11000) {
      const message = "duplicated field value error";
      error = new Error(message);
      error.statusCode = 400;
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      error = new Error(messages.join(", "));
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || "server error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;