import { Router } from "express";
import {
  createResponse,
  getResponses,
  getResponseById,
  getResponsesByTemplate,
  getResponsesByStudent,
} from "../controller/responseController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateJWT, createResponse);
router.get("/", authenticateJWT, getResponses);
router.get("/template/:templateId", authenticateJWT, getResponsesByTemplate);
router.get("/student/:studentId", authenticateJWT, getResponsesByStudent);
router.get("/:id", authenticateJWT, getResponseById);

export default router;
