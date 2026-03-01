import { Request, Response } from "express";
import prisma from "../DB/prismaClient";

export const createTemplate = async (req: any, res: Response) => {
  try {
    console.log('Create Template Request Body:', req.body);
    let { title, description, intro, why, content, isDraft } = req.body;
    const createdById = req.user?.userId;
    if (!createdById) return res.status(401).json({ error: "Unauthorized" });

    // Ensure all fields are objects with language keys
    const toMultilingual = (val: any) => {
      if (!val) return { en: "" };
      if (typeof val === "object") return val;
      return { en: val };
    };
    title = toMultilingual(title);
    description = toMultilingual(description);
    intro = toMultilingual(intro);
    why = toMultilingual(why);

    try {
      const template = await prisma.template.create({
        data: { title, description, intro, why, content, isDraft, createdById },
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
    const template = await prisma.template.findUnique({ where: { id: Number(id) } });
    if (!template) return res.status(404).json({ error: "Template not found" });
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch template", details: error });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { title, description, intro, why, content, isDraft } = req.body;

    // Ensure all fields are objects with language keys
    const toMultilingual = (val: any) => {
      if (!val) return { en: "" };
      if (typeof val === "object") return val;
      return { en: val };
    };
    title = toMultilingual(title);
    description = toMultilingual(description);
    intro = toMultilingual(intro);
    why = toMultilingual(why);

    const template = await prisma.template.update({
      where: { id: Number(id) },
      data: { title, description, intro, why, content, isDraft },
    });
    res.json(template);
  } catch (error) {
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
