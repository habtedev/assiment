import { Request, Response } from 'express';
import prisma from '../DB/prismaClient';
import bcrypt from 'bcrypt';

interface AuthRequest extends Request {
  user?: any;
}

// Create a new student
export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, password, year, sections } = req.body;
    const userId = req.user?.userId;

    console.log('[CREATE STUDENT] Request body:', { name, email, phone, password, year, sections, userId });

    if (!name || !email || !year || !sections || !userId) {
      console.log('[CREATE STUDENT] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user's department
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (!user || !user.department) {
      console.log('[CREATE STUDENT] User or department not found');
      return res.status(400).json({ error: 'User must be assigned to a department' });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const student = await prisma.student.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: 'STUDENT',
        year,
        sections,
        departmentId: user.department.id,
      },
    });

    console.log('[CREATE STUDENT] Student created successfully:', student);
    res.status(201).json(student);
  } catch (error) {
    console.error('[CREATE STUDENT ERROR]', error);
    if (error instanceof Error) {
      console.error('[CREATE STUDENT ERROR] Message:', error.message);
      console.error('[CREATE STUDENT ERROR] Stack:', error.stack);
    }
    res.status(400).json({ error: 'Failed to create student', details: error instanceof Error ? error.message : error });
  }
};

// Get all students
export const getStudents = async (req: AuthRequest, res: Response) => {
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

    const students = await prisma.student.findMany({
      where,
      include: {
        department: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(students);
  } catch (error) {
    console.error('[GET STUDENTS ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch students', details: error instanceof Error ? error.message : error });
  }
};

// Get sections by year
export const getSectionsByYear = async (req: AuthRequest, res: Response) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }

    const students = await prisma.student.findMany({
      where: { year: year as string },
      select: { sections: true },
    });

    // Get unique sections from all students in that year
    const allSections = students.flatMap(s => s.sections || []);
    const uniqueSections = [...new Set(allSections)];

    res.json(uniqueSections);
  } catch (error) {
    console.error('[GET SECTIONS BY YEAR ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch sections', details: error instanceof Error ? error.message : error });
  }
};

// Get a single student by ID
export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: {
        department: true,
      },
    });
 
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('[GET STUDENT ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch student', details: error instanceof Error ? error.message : error });
  }
};

// Update a student
export const updateStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, year, sections, departmentId } = req.body;

    const student = await prisma.student.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(year && { year }),
        ...(sections && { sections }),
        ...(departmentId && { departmentId: Number(departmentId) }),
      },
    });

    res.json(student);
  } catch (error) {
    console.error('[UPDATE STUDENT ERROR]', error);
    res.status(400).json({ error: 'Failed to update student', details: error instanceof Error ? error.message : error });
  }
};

// Delete a student
export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.student.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.error('[DELETE STUDENT ERROR]', error);
    res.status(400).json({ error: 'Failed to delete student', details: error instanceof Error ? error.message : error });
  }
};

// Get all departments
export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    res.json(departments);
  } catch (error) {
    console.error('[GET DEPARTMENTS ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch departments', details: error instanceof Error ? error.message : error });
  }
};

// Get teachers by year and section (for students - only enrolled teachers)
export const getTeachersByYearAndSection = async (req: AuthRequest, res: Response) => {
  try {
    const { year, section } = req.query;

    if (!year || !section) {
      return res.status(400).json({ error: 'Year and section are required' });
    }

    // Get enrollments for this year and section
    const enrollments = await prisma.enrollment.findMany({
      where: {
        year: year as string,
        section: section as string,
      },
      include: {
        teacher: {
          include: {
            department: true,
          },
        },
      },
    });

    // Get unique teachers from enrollments
    const teachersMap = new Map();
    enrollments.forEach(enrollment => {
      if (enrollment.teacher) {
        teachersMap.set(enrollment.teacher.id, enrollment.teacher);
      }
    });

    const teachers = Array.from(teachersMap.values());

    res.json(teachers);
  } catch (error) {
    console.error('[GET TEACHERS BY YEAR AND SECTION ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch teachers', details: error instanceof Error ? error.message : error });
  }
};

// Get all teachers in department (for department admin to create enrollments)
export const getAllTeachersInDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Get user's department
    let departmentId = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { department: true },
      });
      if (user?.department) {
        departmentId = user.department.id;
      }
    }

    // Get all teachers from the department
    const where: any = {};
    if (departmentId) {
      where.departmentId = departmentId;
    }

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        department: true,
      },
    });

    res.json(teachers);
  } catch (error) {
    console.error('[GET ALL TEACHERS IN DEPARTMENT ERROR]', error);
    res.status(400).json({ error: 'Failed to fetch teachers', details: error instanceof Error ? error.message : error });
  }
};
