import { Router } from 'express';
import { adminAddCollege, addDepartment, addStudent, addTeacher, editCollege, deleteCollege } from '../controller/collegeController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import prisma from '../DB/prismaClient';

const router = Router();

// Get a single college by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const college = await prisma.college.findUnique({
      where: { id: Number(id) },
      include: {
        users: true,
        departments: true,
      },
    });
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch college' });
  }
});

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({
      include: {
        users: true,
        departments: true,
      },
    });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

// Edit college
router.put('/:id', authenticateJWT, requireRole('ADMIN'), editCollege);

// Delete college
router.delete('/:id', authenticateJWT, requireRole('ADMIN'), deleteCollege);

// Department head adds student and teacher
router.post('/add-student', authenticateJWT, requireRole('HEAD'), addStudent);
router.post('/add-teacher', authenticateJWT, requireRole('HEAD'), addTeacher);

// College adds a department and department head
router.post('/add-department', authenticateJWT, requireRole('COLLEGE'), addDepartment);

// Admin adds a college
router.post('/add-college', authenticateJWT, requireRole('ADMIN'), adminAddCollege);

export default router;
