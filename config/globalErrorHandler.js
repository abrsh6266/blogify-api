const globalErroHandler = (err, req, res, next) => {
  const status = err?.status ? err?.status : "failed";
  const message = err?.message;
  const stack = err?.stack;

  res.status(500).json({
    status,
    message,
    stack,
  });
};

//not found
const notFoundHandler = (req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on the server`);
  next(err);
};

module.exports = { globalErroHandler, notFoundHandler };
