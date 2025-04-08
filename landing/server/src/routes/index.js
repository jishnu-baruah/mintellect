import express from "express"
import { pdfAnalysisRouter } from "./pdfAnalysis.js"
import { eligibilityCriteriaRouter } from "./eligibilityCriteria.js"
import { plagiarismRouter } from "./plagiarismRoutes.js"
import { trustScoreRouter } from "./trustScoreRoutes.js"
import { ipfsRouter } from "./ipfsRoutes.js"
import { pdfContentRouter } from "./pdfContentRoutes.js"

const router = express.Router()

router.use("/analyze-pdf", pdfAnalysisRouter)
router.use("/eligibility-criteria", eligibilityCriteriaRouter)
router.use("/check-plagiarism", plagiarismRouter)
router.use("/trust-score", trustScoreRouter)
router.use("/upload-paper", ipfsRouter)
router.use("/pdf-content", pdfContentRouter)

export default router
