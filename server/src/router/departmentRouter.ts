import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import prisma from '../DB/prismaClient';

const router = Router();

// Get departments for the logged-in user's college
router.get('/', authenticateJWT, async (req: any, res) => {
  try {
    const collegeId = req.user?.userId ? (await prisma.user.findUnique({ where: { id: req.user.userId } }))?.collegeId : null;
    if (!collegeId) {
      return res.status(400).json({ error: 'College not found for user' });
    }

    const departments = await prisma.department.findMany({
      where: { collegeId },
      include: {
        users: {
          where: { role: { name: 'HEAD' } },
          select: { name: true },
        },
      },
    });

    // Format the response to include headName
    const formattedDepartments = departments.map(dept => ({
      ...dept,
      headName: dept.users[0]?.name || null,
      users: undefined, // Remove users array from response
    }));

    res.json(formattedDepartments);
  } catch (error) {
    console.error('[GET DEPARTMENTS ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Delete a department
router.delete('/:id', authenticateJWT, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Get the department to check college ownership
    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Get collegeId from logged-in user
    const collegeId = req.user?.userId ? (await prisma.user.findUnique({ where: { id: req.user.userId } }))?.collegeId : null;
    if (!collegeId || department.collegeId !== collegeId) {
      return res.status(403).json({ error: 'You do not have permission to delete this department' });
    }

    // Delete all users associated with this department
    await prisma.user.deleteMany({
      where: { departmentId: Number(id) }
    });

    // Delete the department
    await prisma.department.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Department deleted' });
  } catch (error) {
    console.error('[DELETE DEPARTMENT ERROR]', error);
    res.status(400).json({ error: 'Failed to delete department' });
  }
});

export default router;
