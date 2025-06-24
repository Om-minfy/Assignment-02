import { ZodError } from 'zod';

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.errors.map(e => ({ path: e.path, message: e.message })),
    });
  }

  res.status(500).json({ success: false, message: 'Server Error' });
};

export default errorHandler;