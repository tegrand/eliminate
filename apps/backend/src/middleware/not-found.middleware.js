const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    data: null,
    errors: [],
  });
};

export default notFoundMiddleware;