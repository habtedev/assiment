import { Request, Response } from 'express';
import prisma from '../DB/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';


// Register a new college (only by president)
export const registerCollege = async (req: any, res: Response) => {
  try {
    const { email, name, password, collegeName, code, descriptionEn, descriptionAm, phone, addressEn, addressAm, academicYear, status } = req.body;
    // Find or create the COLLEGE_ADMIN role
    let role = await prisma.role.findUnique({ where: { name: 'COLLEGE_ADMIN' } });
    if (!role) role = await prisma.role.create({ data: { name: 'COLLEGE_ADMIN' } });
    // Create the college
    const college = await prisma.college.create({
      data: {
        name: { en: collegeName, am: collegeName },
        code,
        description: { en: descriptionEn, am: descriptionAm },
        email,
        phone,
        address: { en: addressEn, am: addressAm },
        academicYear,
        status,
      }
    });
    // Create the college user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId: role.id,
        collegeId: college.id,
      },
    });
    res.status(201).json({ message: 'College and user registered', user, college });
  } catch (error) {
    res.status(400).json({ error: 'College registration failed', details: error });
  }
};

// Register a new department (only by college admin)
export const registerDepartment = async (req: any, res: Response) => {
  try {
    const { departmentName } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(400).json({ error: 'User not authenticated' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.collegeId) {
      return res.status(400).json({ error: 'College not found for user' });
    }

    // Create the department under the college
    const department = await prisma.department.create({
      data: {
        name: departmentName,
        collegeId: user.collegeId,
      },
    });

    // Assign the user to the department
    await prisma.user.update({
      where: { id: userId },
      data: { departmentId: department.id },
    });

    res.status(201).json({ message: 'Department registered', department });
  } catch (error) {
    res.status(400).json({ error: 'Department registration failed', details: error });
  }
};


// Register a new user (role-based)
export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password, roleId, departmentId, collegeId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId,
        departmentId,
        collegeId,
      },
    });
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed', details: error });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // First try to find user in User table
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        college: true,
        department: true,
      },
    });

    // If not found in User table, check Student table
    if (!user) {
      const student = await prisma.student.findUnique({
        where: { email },
        include: {
          department: {
            include: {
              college: true,
            },
          },
        },
      });

      if (student && student.password) {
        const valid = await bcrypt.compare(password, student.password);
        if (valid) {
          // Create a user-like object for student
          const studentUser = {
            id: student.id,
            email: student.email,
            name: student.name,
            role: { name: student.role || 'STUDENT' },
            college: student.department?.college || null,
            department: student.department,
            isStudent: true,
          };
          const token = jwt.sign(
            { userId: student.id, role: student.role || 'STUDENT', isStudent: true },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
          );
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
          });
          return res.json({ user: studentUser });
        }
      }
    }

    // If not found in Student table, check Teacher table
    if (!user) {
      const teacher = await prisma.teacher.findUnique({
        where: { email },
        include: {
          department: {
            include: {
              college: true,
            },
          },
        },
      });

      if (teacher && teacher.password) {
        const valid = await bcrypt.compare(password, teacher.password);
        if (valid) {
          // Create a user-like object for teacher
          const teacherUser = {
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            role: { name: teacher.role || 'TEACHER' },
            college: teacher.department?.college || null,
            department: teacher.department,
            isTeacher: true,
          };
          const token = jwt.sign(
            { userId: teacher.id, role: teacher.role || 'TEACHER', isTeacher: true },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
          );
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
          });
          return res.json({ user: teacherUser });
        }
      }
    }

    // If user found in User table, authenticate normally
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign(
        { userId: user.id, role: user.role.name },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });
      const { password: userPassword, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(400).json({ error: 'Login failed', details: error });
  }
};

// Get current authenticated user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const isStudent = req.user?.isStudent;
    const isTeacher = req.user?.isTeacher;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if user is a student
    if (isStudent) {
      const student = await prisma.student.findUnique({
        where: { id: userId },
        include: {
          department: {
            include: {
              college: true,
            },
          },
        },
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Create user-like object for student
      const studentUser = {
        id: student.id,
        email: student.email,
        name: student.name,
        year: student.year,
        section: student.sections,
        role: { name: student.role || 'STUDENT' },
        college: student.department?.college || null,
        department: student.department,
        isStudent: true,
      };

      const { password: studentPassword, ...studentWithoutPassword } = student;
      res.json(studentUser);
      return;
    }

    // Check if user is a teacher
    if (isTeacher) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: userId },
        include: {
          department: {
            include: {
              college: true,
            },
          },
        },
      });

      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      // Create user-like object for teacher
      const teacherUser = {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
        role: { name: teacher.role || 'TEACHER' },
        college: teacher.department?.college || null,
        department: teacher.department,
        isTeacher: true,
      };

      const { password: teacherPassword, ...teacherWithoutPassword } = teacher;
      res.json(teacherUser);
      return;
    }

    // Regular user from User table
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        college: true,
        department: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data without password
    const { password: userPassword, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('[GET CURRENT USER ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};
