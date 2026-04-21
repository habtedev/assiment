import { Request, Response } from 'express';
import prisma from '../DB/prismaClient';

interface AuthRequest extends Request {
  user?: any;
}

// Create a new course
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { code, name, credits, hours, instructor } = req.body;
    const userId = req.user?.userId;

    console.log('[CREATE COURSE] Request body:', { code, name, credits, hours, instructor, userId });

    if (!code || !name || !credits || !userId) {
      console.log('[CREATE COURSE] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user's department
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (!user || !user.department) {
      console.log('[CREATE COURSE] User or department not found');
      return res.status(400).json({ error: 'User must be assigned to a department' });
    }

    const course = await prisma.course.create({
      data: {
        code,
        name,
        credits: Number(credits),
        hours: hours ? Number(hours) : null,
        instructor: instructor || null,
        departmentId: user.department.id,
      },
    });

    console.log('[CREATE COURSE] Course created successfully:', course);
    res.status(201).json(course);
  } catch (error) {
    console.error('[CREATE COURSE ERROR]', error);
    if (error instanceof Error) {
      console.error('[CREATE COURSE ERROR] Message:', error.message);
      console.error('[CREATE COURSE ERROR] Stack:', error.stack);
    }
    res.status(400).json({ error: 'Failed to create course', details: error instanceof Error ? error.message : error });
  }
};

// Get all courses
export const getCourses = async (req: AuthRequest, res: Response) => {
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

    const courses = await prisma.course.findMany({
      where,
      include: {
        department: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(courses);
  } catch (error) {
    console.error('[GET COURSES ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch courses', details: error instanceof Error ? error.message : error });
  }
};

// Get a single course by ID
export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        department: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('[GET COURSE BY ID ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch course', details: error instanceof Error ? error.message : error });
  }
};

// Update a course
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, credits, hours, instructor, status } = req.body;

    const course = await prisma.course.update({
      where: { id: Number(id) },
      data: {
        ...(code && { code }),
        ...(name && { name }),
        ...(credits && { credits: Number(credits) }),
        ...(hours !== undefined && { hours: Number(hours) }),
        ...(instructor !== undefined && { instructor }),
        ...(status && { status }),
      },
      include: {
        department: true,
      },
    });

    res.json(course);
  } catch (error) {
    console.error('[UPDATE COURSE ERROR]', error);
    res.status(400).json({ error: 'Failed to update course', details: error instanceof Error ? error.message : error });
  }
};

// Delete a course
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.course.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('[DELETE COURSE ERROR]', error);
    res.status(400).json({ error: 'Failed to delete course', details: error instanceof Error ? error.message : error });
  }
};
