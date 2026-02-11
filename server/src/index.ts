// Health check endpoint for testing
import { Request, Response } from 'express';
import app from './app';
import { connectPrisma } from './DB/prismaClient';


// Health checker
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});


const PORT = process.env.PORT;

connectPrisma().then(() => {
  app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/health`);
  });
});
