import express from "express"
import { uploadToIPFS } from "../controllers/ipfsController.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.post("/", asyncHandler(uploadToIPFS))

// Use named export instead of default export
export { router as ipfsRouter }

