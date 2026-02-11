import { Router } from 'express';
import { adminAddCollege, addDepartment, addStudent, addTeacher } from '../controller/collegeController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Department head adds student and teacher
router.post('/add-student', authenticateJWT, requireRole('HEAD'), addStudent);
router.post('/add-teacher', authenticateJWT, requireRole('HEAD'), addTeacher);

// College adds a department and department head
router.post('/add-department', authenticateJWT, requireRole('COLLEGE'), addDepartment);

// Admin adds a college
router.post('/add-college', authenticateJWT, requireRole('ADMIN'), adminAddCollege);

export default router;
