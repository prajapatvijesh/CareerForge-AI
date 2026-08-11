import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
};

export const getReady = (req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (isDbConnected) {
    res.status(200).json({ status: 'success', message: 'API is ready' });
  } else {
    res.status(503).json({ status: 'error', message: 'API is not ready' });
  }
};
