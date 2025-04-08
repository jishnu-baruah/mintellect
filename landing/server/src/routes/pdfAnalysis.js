import express from "express"
import multer from "multer"
import { analyzePdf } from "../controllers/pdfAnalysisController.js"
import asyncHandler from "../utils/asyncHandler.js"
import { PDF_CHECKS } from "../services/pdfExtractor.js"

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/temp")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: PDF_CHECKS.MAX_FILE_SIZE }, // Use the same limit from PDF_CHECKS
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false)
    }
    cb(null, true)
  },
})

router.post("/", upload.single("pdf"), asyncHandler(analyzePdf))

// Use named export instead of default export
export { router as pdfAnalysisRouter }

