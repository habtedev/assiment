// Edit college
export const editCollege = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert string fields to multilingual format if needed
    const dataToUpdate: any = { ...updateData };

    if (updateData.name && typeof updateData.name === 'string') {
      dataToUpdate.name = { en: updateData.name, am: updateData.name };
    }

    const college = await prisma.college.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
    res.json(college);
  } catch (error) {
    console.error('[EDIT COLLEGE ERROR]', error);
    res.status(400).json({ error: 'Failed to update college', details: error instanceof Error ? error.message : error });
  }
};

// Delete college
export const deleteCollege = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log('[DELETE COLLEGE] Deleting college with ID:', id);

    // First, delete all departments associated with this college
    await prisma.department.deleteMany({
      where: { collegeId: Number(id) }
    });

    // Then, delete all users associated with this college
    await prisma.user.deleteMany({
      where: { collegeId: Number(id) }
    });

    // Finally, delete the college
    await prisma.college.delete({ where: { id: Number(id) } });

    res.json({ message: 'College deleted' });
  } catch (error) {
    console.error('[DELETE COLLEGE ERROR]', error);
    res.status(400).json({ error: 'Failed to delete college', details: error instanceof Error ? error.message : error });
  }
};
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
    const { departmentName, departmentCode, contactEmail, contactPhone, adminName, adminPassword, academicYear } = req.body;
    console.log('[ADD DEPARTMENT] Request body:', req.body);
    
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
        code: departmentCode,
        email: contactEmail,
        phone: contactPhone,
        academicYear,
        collegeId,
      },
    });
    
    // Create the department head user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: contactEmail,
        name: adminName,
        password: hashedPassword,
        roleId: headRole.id,
        departmentId: department.id,
        collegeId,
      },
    });
    
    res.status(201).json({ message: 'Department and head user created', department, user });
  } catch (error: any) {
    console.error('[ADD DEPARTMENT ERROR]', error);

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'name') {
        return res.status(400).json({ error: 'Department name already exists' });
      }
      if (field === 'code') {
        return res.status(400).json({ error: 'Department code already exists' });
      }
      return res.status(400).json({ error: 'A department with this information already exists' });
    }

    res.status(400).json({ error: 'Department creation failed', details: error.message });
  }
};

// Admin adds a new college and admin user
export const adminAddCollege = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, adminName, adminPassword, code, phone, academicYear } = req.body;
    console.log('[ADD COLLEGE] Request body:', req.body);
    // Ensure COLLEGE role exists
    let collegeRole = await prisma.role.findUnique({ where: { name: 'COLLEGE' } });
    if (!collegeRole) {
      collegeRole = await prisma.role.create({ data: { name: 'COLLEGE' } });
    }
    // Create the college
    const college = await prisma.college.create({
      data: {
        name: { en: name || "", am: name || "" },
        code,
        description: { en: "", am: "" },
        email,
        phone,
        address: { en: "", am: "" },
        academicYear,
        status: "active",
      }
    });
    // Create the college user with COLLEGE role
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        name: adminName,
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
