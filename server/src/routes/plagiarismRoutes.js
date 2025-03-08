import express from "express"
import { checkPlagiarism } from "../controllers/plagiarismController.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.post("/", asyncHandler(checkPlagiarism))

// Use named export instead of default export
export { router as plagiarismRouter }

