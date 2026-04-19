import express from 'express';
import cors from 'cors';
import authRouter from './router/authRouter';
import collegeRouter from './router/collegeRouter';
import departmentRouter from './router/departmentRouter';
import templateRouter from './router/templateRouter';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';



const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Auth routes
app.use('/api/auth', authRouter);
// Admin college routes
app.use('/api/admin', collegeRouter);
// Public college fetch route
app.use('/api/colleges', collegeRouter);
// Department routes
app.use('/api/departments', departmentRouter);
// Template CRUD routes
app.use('/api/templates', templateRouter);

export default app;
