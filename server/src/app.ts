
import express from 'express';
import cors from 'cors';
import authRouter from './router/authRouter';
import collegeRouter from './router/collegeRouter';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';



const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Auth routes
app.use('/api/auth', authRouter);
// Admin college routes
app.use('/api/admin', collegeRouter);

export default app;
