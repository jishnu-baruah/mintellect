import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import routes from "./routes/index.js"
import errorHandler from "./middleware/errorHandler.js"
import { checkPlagiarism } from "./controllers/plagiarismController.js"
import { getTrustScore } from "./controllers/trustScoreController.js"
import { uploadPaper } from "./controllers/paperUploadController.js"
import { uploadToIPFS } from "./controllers/ipfsController.js"
import { getPdfContent } from "./controllers/pdfContentController.js"
import asyncHandler from "./utils/asyncHandler.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

// Serve static files from the 'public' directory
app.use(express.static(join(__dirname, "../public")))

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(join(__dirname, "../uploads")))

// Serve static files from the 'repository' directory
app.use("/repository", express.static(join(__dirname, "../repository")))

// Routes
app.use("/api", routes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Service is running" })
})

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../public/index.html"))
})

// Add direct routes for plagiarism check, trust score, paper upload, and IPFS upload
app.post("/api/check-plagiarism", asyncHandler(checkPlagiarism))
app.post("/api/trust-score", asyncHandler(getTrustScore))
app.post("/api/upload-paper", asyncHandler(uploadPaper))
app.post("/api/upload-to-ipfs", asyncHandler(uploadToIPFS))
app.post("/api/pdf-content", asyncHandler(getPdfContent))

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})

export default app
