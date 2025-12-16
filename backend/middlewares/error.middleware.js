const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'The uploaded file exceeds the maximum allowed size'
      });
    }
    return res.status(400).json({
      error: 'Upload error',
      message: err.message
    });
  }

  // Validation errors
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: err.message
    });
  }

  // Database errors
  if (err.message && err.message.includes('Failed to')) {
    return res.status(500).json({
      error: 'Database error',
      message: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
};

module.exports = errorMiddleware;
