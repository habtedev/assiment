import { Request, Response } from "express";
import prisma from "../DB/prismaClient";

export const createTemplate = async (req: any, res: Response) => {
  try {
    console.log('Create Template Request Body:', req.body);
    const {
      name, // Frontend sends 'name', backend expects 'title'
      description,
      intro,
      why,
      questions, // Frontend sends 'questions', backend expects 'content'
      calendarType,
      academicYear,
      semester,
      targetAudience,
      isDraft,
      status
    } = req.body;
    const createdById = req.user?.userId;
    if (!createdById) return res.status(401).json({ error: "Unauthorized" });

    const content = { questions }; // Wrap questions in content object

    try {
      const template = await prisma.template.create({
        data: {
          title: name || "",
          description: description || "",
          intro: intro || "",
          why: why || "",
          content,
          calendarType: calendarType || "ethiopian",
          academicYear: academicYear || "",
          semester: semester || "",
          targetAudience: targetAudience || "student",
          isDraft: isDraft || false,
          status: status || "inactive",
          createdById,
        },
      });
      res.status(201).json(template);
    } catch (prismaError: any) {
      console.error('Prisma error creating template:', prismaError);
      res.status(500).json({ error: "Failed to create template", details: prismaError && typeof prismaError === 'object' && 'message' in prismaError ? prismaError.message : String(prismaError) });
    }
  } catch (error: any) {
    console.error('General error in createTemplate:', error);
    res.status(500).json({ error: "Failed to create template", details: error && typeof error === 'object' && 'message' in error ? error.message : String(error) });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.template.findMany();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates", details: error });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Fetching template by ID:', id);
    const template = await prisma.template.findUnique({ where: { id: Number(id) } });
    if (!template) return res.status(404).json({ error: "Template not found" });
    console.log('Template found:', template);
    console.log('Template content:', template.content);
    res.json(template);
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    res.status(500).json({ error: "Failed to fetch template", details: error });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name, // Frontend sends 'name', backend expects 'title'
      description,
      intro,
      why,
      questions, // Frontend sends 'questions', backend expects 'content'
      calendarType,
      academicYear,
      semester,
      targetAudience,
      isDraft,
      deadline,
      status
    } = req.body;

    console.log('Update Template Request Body:', req.body);
    console.log('Status received:', status);

    const updateData: any = {};

    // Only update fields that are explicitly provided
    if (name !== undefined) {
      updateData.title = name;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (intro !== undefined) {
      updateData.intro = intro;
    }
    if (why !== undefined) {
      updateData.why = why;
    }
    if (questions !== undefined) {
      updateData.content = { questions };
    }
    if (calendarType !== undefined) {
      updateData.calendarType = calendarType;
    }
    if (academicYear !== undefined) {
      updateData.academicYear = academicYear;
    }
    if (semester !== undefined) {
      updateData.semester = semester;
    }
    if (targetAudience !== undefined) {
      updateData.targetAudience = targetAudience;
    }
    if (isDraft !== undefined) {
      updateData.isDraft = isDraft;
    }
    if (deadline !== undefined) {
      updateData.deadline = deadline;
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    console.log('Update Data:', updateData);

    const template = await prisma.template.update({
      where: { id: Number(id) },
      data: updateData,
    });
    console.log('Updated Template:', template);
    res.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: "Failed to update template", details: error });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.template.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete template", details: error });
  }
};
