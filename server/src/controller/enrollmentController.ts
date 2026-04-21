import { Request, Response } from 'express';
import prisma from '../DB/prismaClient';

interface AuthRequest extends Request {
  user?: any;
}

// Create a new enrollment
export const createEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, teacherId, year, section } = req.body;
    const userId = req.user?.userId;

    console.log('[CREATE ENROLLMENT] Request body:', { courseId, teacherId, year, section, userId });

    if (!courseId || !teacherId || !year || !section) {
      console.log('[CREATE ENROLLMENT] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: Number(courseId),
        teacherId: Number(teacherId),
        year,
        section,
        status: 'active',
      },
      include: {
        course: true,
        teacher: true,
      },
    });

    console.log('[CREATE ENROLLMENT] Enrollment created successfully:', enrollment);
    res.status(201).json(enrollment);
  } catch (error) {
    console.error('[CREATE ENROLLMENT ERROR]', error);
    if (error instanceof Error) {
      console.error('[CREATE ENROLLMENT ERROR] Message:', error.message);
      console.error('[CREATE ENROLLMENT ERROR] Stack:', error.stack);
    }
    res.status(400).json({ error: 'Failed to create enrollment', details: error instanceof Error ? error.message : error });
  }
};

// Get all enrollments
export const getEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const { year, section } = req.query;
    const userId = req.user?.userId;

    let where = {};

    // Filter by year and section if provided
    if (year) {
      where = { ...where, year: year as string };
    }
    if (section) {
      where = { ...where, section: section as string };
    }

    // If user is authenticated, filter by their department
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { department: true },
      });

      if (user?.department) {
        where = {
          ...where,
          course: {
            departmentId: user.department.id,
          },
        };
      }
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        course: {
          include: {
            department: true,
          },
        },
        teacher: {
          include: {
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(enrollments);
  } catch (error) {
    console.error('[GET ENROLLMENTS ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch enrollments', details: error instanceof Error ? error.message : error });
  }
};

// Get a single enrollment by ID
export const getEnrollmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: Number(id) },
      include: {
        course: true,
        teacher: true,
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    console.error('[GET ENROLLMENT BY ID ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch enrollment', details: error instanceof Error ? error.message : error });
  }
};

// Update an enrollment
export const updateEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, year, section } = req.body;

    const enrollment = await prisma.enrollment.update({
      where: { id: Number(id) },
      data: {
        ...(status && { status }),
        ...(year && { year }),
        ...(section && { section }),
      },
      include: {
        course: true,
        teacher: true,
      },
    });

    res.json(enrollment);
  } catch (error) {
    console.error('[UPDATE ENROLLMENT ERROR]', error);
    res.status(400).json({ error: 'Failed to update enrollment', details: error instanceof Error ? error.message : error });
  }
};

// Delete an enrollment
export const deleteEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.enrollment.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('[DELETE ENROLLMENT ERROR]', error);
    res.status(400).json({ error: 'Failed to delete enrollment', details: error instanceof Error ? error.message : error });
  }
};
