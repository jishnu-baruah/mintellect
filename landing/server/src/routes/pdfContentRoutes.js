import express from "express"
import { getPdfContent } from "../controllers/pdfContentController.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.post("/", asyncHandler(getPdfContent))

// Use named export instead of default export
export { router as pdfContentRouter }
