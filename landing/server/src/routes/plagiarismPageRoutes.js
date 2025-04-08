import express from "express"
import { getPlagiarismAnalysis } from "../controllers/plagiarismPageController.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.post("/", asyncHandler(getPlagiarismAnalysis))

// Use named export instead of default export
export { router as plagiarismPageRouter }
