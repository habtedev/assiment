import { Request, Response } from 'express';
import prisma from '../DB/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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
    const collegeId = req.user?.userId ? (await prisma.user.findUnique({ where: { id: req.user.userId } }))?.collegeId : null;
    if (!collegeId) return res.status(400).json({ error: 'College not found for user' });
    // Create the department under the college
    const department = await prisma.department.create({
      data: {
        name: departmentName,
        collegeId,
      },
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
    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, role: user.role.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    // Set JWT cookie with best practices
    res.cookie('token', token, {
      httpOnly: true, // Prevent JS access
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Strict in prod, lax in dev
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/', // Send cookie to all routes
    });
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Login failed', details: error });
  }
};
