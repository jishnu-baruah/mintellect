import express from "express"
import { getEligibilityCriteria } from "../controllers/eligibilityCriteriaController.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.get("/", asyncHandler(getEligibilityCriteria))

// Use named export instead of default export
export { router as eligibilityCriteriaRouter }

