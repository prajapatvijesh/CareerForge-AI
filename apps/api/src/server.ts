import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { connectDB } from './config/db';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './config/swagger';
import { healthRouter } from './modules/health/health.route';
import { authRouter } from './modules/auth/auth.route';
import { profileRouter } from './modules/profile/profile.route';
import { resumeRouter } from './modules/resume/resume.route';
import { dashboardRouter } from './modules/dashboard/dashboard.route';
import { jobRouter } from './modules/job/job.route';
import { analysisRouter } from './modules/resume-analysis/analysis.route';
import { mockInterviewRouter } from './modules/mock-interview/mock-interview.route';
import subscriptionRouter from './modules/subscription/subscription.route';

export const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({
  limit: '5mb',
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased to 1000 to allow for resume autosave bursts
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter);

// Serve static files for mock uploads
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use('/api/v1/health', healthRouter);
import { getReady } from './modules/health/health.controller';
app.get('/api/v1/ready', getReady);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/resumes', resumeRouter);
app.use('/api/v1/resume-analysis', analysisRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/mock-interview', mockInterviewRouter);
app.use('/api/v1/subscription', subscriptionRouter);
import { billingRouter } from './modules/billing/billing.route';
app.use('/api/v1/billing', billingRouter);
import { adminRouter } from './modules/admin/admin.route';
import { careerAssistantRouter } from './modules/career-assistant/career-assistant.route';
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/career-assistant', careerAssistantRouter);

// Swagger Documentation
if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// 404 Handler
app.use((_req, res, _next) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

// Server Initialization
const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    if (env.NODE_ENV !== 'production') {
      logger.info(`API Documentation available at http://localhost:${env.PORT}/api-docs`);
    }
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
