import { Request, Response } from 'express';
import prisma from '../DB/prismaClient';

interface AuthRequest extends Request {
  user?: any;
}

// Create a new teacher
export const createTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, title } = req.body;
    const userId = req.user?.userId;

    console.log('[CREATE TEACHER] Request body:', { name, email, phone, title, userId });

    if (!name || !email || !userId) {
      console.log('[CREATE TEACHER] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user's department
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (!user || !user.department) {
      console.log('[CREATE TEACHER] User or department not found');
      return res.status(400).json({ error: 'User must be assigned to a department' });
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        phone: phone || null,
        title: title || null,
        departmentId: user.department.id,
      },
    });

    console.log('[CREATE TEACHER] Teacher created successfully:', teacher);
    res.status(201).json(teacher);
  } catch (error) {
    console.error('[CREATE TEACHER ERROR]', error);
    if (error instanceof Error) {
      console.error('[CREATE TEACHER ERROR] Message:', error.message);
      console.error('[CREATE TEACHER ERROR] Stack:', error.stack);
    }
    res.status(400).json({ error: 'Failed to create teacher', details: error instanceof Error ? error.message : error });
  }
};

// Get all teachers
export const getTeachers = async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId, departmentName } = req.query;
    const userId = req.user?.userId;

    let where = {};

    // If user is authenticated, use their department
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { department: true },
      });

      if (user?.department) {
        where = { departmentId: user.department.id };
      }
    } else if (departmentName) {
      // Fallback to query parameter if user not authenticated
      const department = await prisma.department.findUnique({
        where: { name: departmentName as string },
      });
      if (department) {
        where = { departmentId: department.id };
      }
    } else if (departmentId) {
      where = { departmentId: Number(departmentId) };
    }

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        department: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(teachers);
  } catch (error) {
    console.error('[GET TEACHERS ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch teachers', details: error instanceof Error ? error.message : error });
  }
};

// Get a single teacher by ID
export const getTeacherById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { id: Number(id) },
      include: {
        department: true,
      },
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error('[GET TEACHER ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch teacher', details: error instanceof Error ? error.message : error });
  }
};

// Update a teacher
export const updateTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, title, departmentName } = req.body;

    let departmentId;
    if (departmentName) {
      const department = await prisma.department.findUnique({
        where: { name: departmentName },
      });
      if (department) {
        departmentId = department.id;
      }
    }

    const teacher = await prisma.teacher.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(title !== undefined && { title: title || null }),
        ...(departmentId && { departmentId }),
      },
    });

    res.json(teacher);
  } catch (error) {
    console.error('[UPDATE TEACHER ERROR]', error);
    res.status(400).json({ error: 'Failed to update teacher', details: error instanceof Error ? error.message : error });
  }
};

// Delete a teacher
export const deleteTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.teacher.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    console.error('[DELETE TEACHER ERROR]', error);
    res.status(400).json({ error: 'Failed to delete teacher', details: error instanceof Error ? error.message : error });
  }
};
