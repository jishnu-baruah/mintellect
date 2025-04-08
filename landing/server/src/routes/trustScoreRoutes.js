import express from "express"
import { getTrustScore } from "../controllers/trustScoreController.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.post("/", asyncHandler(getTrustScore))

// Use named export instead of default export
export { router as trustScoreRouter }

