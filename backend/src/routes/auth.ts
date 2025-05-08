// auth.ts (or auth.routes.ts depending on your naming convention)
import express from "express";
import { registerUser } from "../controllers/auth.controller.ts";


const router = express.Router(); // Initialize the express router

// Define routes and map them to controller functions
router.post("/register", registerUser); // Use registerUser for /register endpoint

export default router; // Export router to be used in your app
