import { Response } from "express";
import prisma from "../DB/prismaClient";

export const createResponse = async (req: any, res: Response) => {
  try {
    const { templateId, teacherId, answers, submittedAt } = req.body;
    const studentId = req.user?.userId;

    if (!templateId || !answers) {
      return res.status(400).json({ error: "templateId and answers are required" });
    }

    const response = await prisma.response.create({
      data: {
        templateId: Number(templateId),
        answers,
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
        studentId: studentId ? Number(studentId) : null,
        teacherId: teacherId ? Number(teacherId) : null,
      },
    });

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating response:", error);
    res.status(500).json({ error: "Failed to create response" });
  }
};

export const getResponses = async (req: any, res: Response) => {
  try {
    const responses = await prisma.response.findMany({
      include: {
        template: true,
        student: true,
      },
    });
    res.json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};

export const getResponseById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const response = await prisma.response.findUnique({
      where: { id: Number(id) },
      include: {
        template: true,
        student: true,
      },
    });

    if (!response) {
      return res.status(404).json({ error: "Response not found" });
    }

    res.json(response);
  } catch (error) {
    console.error("Error fetching response:", error);
    res.status(500).json({ error: "Failed to fetch response" });
  }
};

export const getResponsesByTemplate = async (req: any, res: Response) => {
  try {
    const { templateId } = req.params;
    const responses = await prisma.response.findMany({
      where: { templateId: Number(templateId) },
      include: {
        student: true,
      },
    });
    res.json(responses);
  } catch (error) {
    console.error("Error fetching responses by template:", error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};

export const getResponsesByStudent = async (req: any, res: Response) => {
  try {
    const { studentId } = req.params;
    const responses = await prisma.response.findMany({
      where: { studentId: Number(studentId) },
      include: {
        template: true,
      },
    });
    res.json(responses);
  } catch (error) {
    console.error("Error fetching responses by student:", error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};
