import fs from 'fs';
import path from 'path';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  const log = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
  };
  fs.appendFileSync(
    path.join('logs', 'app.log'),
    JSON.stringify(log) + '\n',
    'utf8'
  );

  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;