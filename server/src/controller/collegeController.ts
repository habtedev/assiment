// Department head adds a student
export const addStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body; // Add password
    // Get departmentId from logged-in user
    const departmentId = req.user?.userId ? (await prisma.user.findUnique({ where: { id: req.user.userId } }))?.departmentId : null;
    if (!departmentId) return res.status(400).json({ error: 'Department not found for user' });
    // Ensure STUDENT role exists
    let studentRole = await prisma.role.findUnique({ where: { name: 'STUDENT' } });
    if (!studentRole) {
      studentRole = await prisma.role.create({ data: { name: 'STUDENT' } });
    }
    // Create the student user
    // Hash provided password or use default
    const hashedPassword = await bcrypt.hash(password || 'student123', 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        roleId: studentRole.id,
        departmentId,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'Student created', user });
  } catch (error) {
    console.error('[ADD STUDENT ERROR]', error);
    res.status(400).json({ error: 'Student creation failed', details: error instanceof Error ? error.message : error });
  }
};

// Department head adds a teacher
export const addTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // Get departmentId from logged-in user
    const departmentId = req.user?.userId ? (await prisma.user.findUnique({ where: { id: req.user.userId } }))?.departmentId : null;
    if (!departmentId) return res.status(400).json({ error: 'Department not found for user' });
    // Ensure TEACHER role exists
    let teacherRole = await prisma.role.findUnique({ where: { name: 'TEACHER' } });
    if (!teacherRole) {
      teacherRole = await prisma.role.create({ data: { name: 'TEACHER' } });
    }
    // Create the teacher user
    // Hash provided password or use default
    const hashedPassword = await bcrypt.hash(password || 'teacher123', 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        roleId: teacherRole.id,
        departmentId,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'Teacher created', user });
  } catch (error) {
    console.error('[ADD TEACHER ERROR]', error);
    res.status(400).json({ error: 'Teacher creation failed', details: error instanceof Error ? error.message : error });
  }
};
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../DB/prismaClient';
import bcrypt from 'bcrypt';

// College adds a new department and department head user
export const addDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, departmentName } = req.body;
    // Get collegeId from logged-in user
    const collegeId = req.user?.userId ? (await prisma.user.findUnique({ where: { id: req.user.userId } }))?.collegeId : null;
    if (!collegeId) return res.status(400).json({ error: 'College not found for user' });
    // Ensure HEAD role exists
    let headRole = await prisma.role.findUnique({ where: { name: 'HEAD' } });
    if (!headRole) {
      headRole = await prisma.role.create({ data: { name: 'HEAD' } });
    }
    // Create the department under the college
    const department = await prisma.department.create({
      data: {
        name: departmentName,
        collegeId,
      },
    });
    // Create the department head user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId: headRole.id,
        departmentId: department.id,
        collegeId,
      },
    });
    res.status(201).json({ message: 'Department and head user created', department, user });
  } catch (error) {
    console.error('[ADD DEPARTMENT ERROR]', error);
    res.status(400).json({ error: 'Department creation failed', details: error instanceof Error ? error.message : error });
  }
};

// Admin adds a new college and admin user
export const adminAddCollege = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, collegeName } = req.body;
    console.log('[ADD COLLEGE] Request body:', req.body);
    // Ensure COLLEGE role exists
    let collegeRole = await prisma.role.findUnique({ where: { name: 'COLLEGE' } });
    if (!collegeRole) {
      collegeRole = await prisma.role.create({ data: { name: 'COLLEGE' } });
    }
    // Create the college
    const college = await prisma.college.create({ data: { name: collegeName } });
    // Create the college user with COLLEGE role
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId: collegeRole.id,
        collegeId: college.id,
      },
    });
    res.status(201).json({ message: 'College and user created', user, college });
  } catch (error) {
    console.error('[ADD COLLEGE ERROR]', error);
    res.status(400).json({ error: 'College creation failed', details: error instanceof Error ? error.message : error });
  }
};
