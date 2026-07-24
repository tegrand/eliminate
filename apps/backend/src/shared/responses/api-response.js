class ApiResponse {
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      errors: [],
    });
  }

  static error(res, message, errors = [], statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      errors,
    });
  }
}

export default ApiResponse;
