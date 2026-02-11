import { Request, Response } from 'express';
import prisma from '../DB/prismaClient';

// Change user role
export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, newRole } = req.body;
    // Find the role by name
    const role = await prisma.role.findUnique({ where: { name: newRole } });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    // Update the user's role
    const user = await prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id },
    });
    res.status(200).json({ message: 'Role updated', user });
  } catch (error) {
    res.status(400).json({ error: 'Role update failed', details: error });
  }
};

// Example roles: 'ADMIN', 'STUDENT', 'COLLEGE_ADMIN', 'TEACHER'
