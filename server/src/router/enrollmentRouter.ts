import express from 'express';
import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from '../controller/enrollmentController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Create a new enrollment
router.post('/', authenticateJWT, createEnrollment);

// Get all enrollments
router.get('/', authenticateJWT, getEnrollments);

// Get a single enrollment by ID
router.get('/:id', authenticateJWT, getEnrollmentById);

// Update an enrollment
router.put('/:id', authenticateJWT, updateEnrollment);

// Delete an enrollment
router.delete('/:id', authenticateJWT, deleteEnrollment);

export default router;
