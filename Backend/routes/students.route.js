import express from "express";
import {
  getStudent,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../controllers/student.controller.js";

const router = express.Router();

router.get("/students", getStudent);
router.get("/students/:id", getStudentById);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

export default router;