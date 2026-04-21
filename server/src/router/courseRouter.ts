import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controller/courseController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Create a new course
router.post('/', authenticateJWT, createCourse);

// Get all courses (optionally filter by department)
router.get('/', authenticateJWT, getCourses);

// Get a single course by ID
router.get('/:id', authenticateJWT, getCourseById);

// Update a course
router.put('/:id', authenticateJWT, updateCourse);

// Delete a course
router.delete('/:id', authenticateJWT, deleteCourse);

export default router;
