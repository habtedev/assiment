import { Router } from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controller/templateController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateJWT, createTemplate);
router.get("/", authenticateJWT, getTemplates);
router.get("/:id", authenticateJWT, getTemplateById);
router.put("/:id", authenticateJWT, updateTemplate);
router.patch("/:id", authenticateJWT, updateTemplate);
router.delete("/:id", authenticateJWT, deleteTemplate);

export default router;
