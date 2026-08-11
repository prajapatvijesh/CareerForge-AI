import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CareerForge AI API',
    version: '1.0.0',
    description: 'API documentation for CareerForge AI',
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api/v1`,
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.docs.ts', './src/modules/**/*.route.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
