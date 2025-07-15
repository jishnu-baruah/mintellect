import dotenv from "dotenv"
import app from "./app.js"
import logger from "./utils/logger.js"
import { createDir } from "./utils/fileUtils.js"

// Load environment variables
dotenv.config()

// Create necessary directories
createDir("./uploads")
createDir("./uploads/temp")
createDir("./public")

const PORT = process.env.PORT || 3001

// Log environment variables (be careful not to log sensitive information in production)
logger.info(`HUGGING_FACE_TOKEN is ${process.env.HUGGING_FACE_TOKEN ? "set" : "not set"}`)

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`)
})

