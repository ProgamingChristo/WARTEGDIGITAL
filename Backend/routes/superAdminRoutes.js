import express from "express";
import {
  registerSuperAdmin,
  loginSuperAdmin,
  getAllData,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
} from "../controllers/superAdminController.js";
import { verifyToken, verifySuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerSuperAdmin);
router.post("/login", loginSuperAdmin);

// SuperAdmin protected routes
router.get("/data", verifyToken, verifySuperAdmin, getAllData);

// CRUD Admin
router.post("/admin", verifyToken, verifySuperAdmin, createAdmin);
router.get("/admin", verifyToken, verifySuperAdmin, getAllAdmins);
router.put("/admin/:id", verifyToken, verifySuperAdmin, updateAdmin);
router.delete("/admin/:id", verifyToken, verifySuperAdmin, deleteAdmin);

export default router;
