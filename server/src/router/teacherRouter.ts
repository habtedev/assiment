import express from 'express';
import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from '../controller/teacherController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Create a new teacher
router.post('/', authenticateJWT, createTeacher);

// Get all teachers (optionally filter by department)
router.get('/', authenticateJWT, getTeachers);

// Get a single teacher by ID
router.get('/:id', authenticateJWT, getTeacherById);

// Update a teacher
router.put('/:id', authenticateJWT, updateTeacher);

// Delete a teacher
router.delete('/:id', authenticateJWT, deleteTeacher);

export default router;
