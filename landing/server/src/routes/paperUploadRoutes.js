import express from "express"
import { uploadPaper } from "../controllers/paperUploadController.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.post("/", asyncHandler(uploadPaper))

// Use named export instead of default export
export { router as paperUploadRouter }

