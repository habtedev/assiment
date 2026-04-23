import express from 'express';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getDepartments,
  getSectionsByYear,
  getTeachersByYearAndSection,
  getAllTeachersInDepartment,
} from '../controller/studentController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Get all departments (public endpoint)
router.get('/departments/list', getDepartments);

// Create a new student
router.post('/', authenticateJWT, createStudent);

// Get all students (optionally filter by department)
router.get('/', authenticateJWT, getStudents);

// Get sections by year
router.get('/sections', authenticateJWT, getSectionsByYear);

// Get teachers by year and section (for students - only enrolled teachers)
router.get('/teachers', authenticateJWT, getTeachersByYearAndSection);

// Get all teachers in department (for department admin)
router.get('/teachers/all', authenticateJWT, getAllTeachersInDepartment);

// Get a single student by ID
router.get('/:id', authenticateJWT, getStudentById);

// Update a student
router.put('/:id', authenticateJWT, updateStudent);

// Delete a student
router.delete('/:id', authenticateJWT, deleteStudent);

export default router;
