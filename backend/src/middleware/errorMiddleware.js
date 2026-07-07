const sanitizeMessage = (message) => {
  if (!message) return message;
  const apiKey = process.env.TMDB_API_KEY;
  if (apiKey && apiKey !== 'your_tmdb_api_key_here') {
    // Escape regex characters just in case the API key contains any
    const escapedKey = apiKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return message.replace(new RegExp(escapedKey, 'g'), '[REDACTED]');
  }
  return message;
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const rawMessage = err.message || 'Internal Server Error';
  const sanitizedMessage = sanitizeMessage(rawMessage);

  console.error(`[Error] Status: ${status} | Message: ${sanitizedMessage}`);
  if (err.stack) {
    console.error(sanitizeMessage(err.stack));
  }

  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: sanitizedMessage,
  });
};
