import { Router } from 'express';
import { register, login, registerCollege, registerDepartment, getCurrentUser } from '../controller/authController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current authenticated user
router.get('/me', authenticateJWT, getCurrentUser);

// Register college (only by president)
router.post('/register-college', authenticateJWT, requireRole('PRESIDENT'), registerCollege);

// Register department (only by college admin)
router.post('/register-department', authenticateJWT, requireRole('COLLEGE_ADMIN'), registerDepartment);

export default router;
