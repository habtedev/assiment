import express from 'express';
import cors from 'cors';
import authRouter from './router/authRouter';
import collegeRouter from './router/collegeRouter';
import departmentRouter from './router/departmentRouter';
import templateRouter from './router/templateRouter';
import studentRouter from './router/studentRouter';
import teacherRouter from './router/teacherRouter';
import courseRouter from './router/courseRouter';
import enrollmentRouter from './router/enrollmentRouter';
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
// Student CRUD routes
app.use('/api/students', studentRouter);
// Teacher CRUD routes
app.use('/api/teachers', teacherRouter);
// Course CRUD routes
app.use('/api/courses', courseRouter);
// Enrollment CRUD routes
app.use('/api/enrollments', enrollmentRouter);

export default app;
