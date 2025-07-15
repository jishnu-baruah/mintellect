document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.getElementById("uploadForm")
  const fileInput = document.getElementById("pdfFile")
  const loadingIndicator = document.getElementById("loadingIndicator")
  const progressIndicator = document.getElementById("progressIndicator")
  const steps = document.querySelectorAll(".step")

  // Section elements
  const uploadSection = document.getElementById("uploadSection")
  const eligibilitySection = document.getElementById("eligibilitySection")
  const plagiarismSection = document.getElementById("plagiarismSection")
  const trustScoreSection = document.getElementById("trustScoreSection")
  const ipfsSection = document.getElementById("ipfsSection")
  const repositorySection = document.getElementById("ipfsSection") // Fixed: Declared repositorySection

  // Navigation buttons
  const backToUploadBtn = document.getElementById("backToUploadBtn")
  const proceedToPlagiarismBtn = document.getElementById("proceedToPlagiarismBtn")
  const backToEligibilityBtn = document.getElementById("backToEligibilityBtn")
  const proceedToTrustScoreBtn = document.getElementById("proceedToTrustScoreBtn")
  const backToPlagiarismBtn = document.getElementById("backToPlagiarismBtn")
  const proceedToUploadBtn = document.getElementById("proceedToUploadBtn")
  const backToTrustScoreBtn = document.getElementById("backToTrustScoreBtn")
  const proceedToIPFSBtn = document.getElementById("proceedToIPFSBtn")
  const startNewAnalysisBtn = document.getElementById("startNewAnalysisBtn")

  // Result elements
  const eligibilityStatus = document.getElementById("eligibilityStatus")
  const level0 = document.getElementById("level0")
  const level1 = document.getElementById("level1")
  const level2 = document.getElementById("level2")
  const metadataList = document.getElementById("metadataList")
  const plagiarismResults = document.getElementById("plagiarismResults")
  const trustScoreResults = document.getElementById("trustScoreResults")
  const uploadResults = document.getElementById("uploadResults")
  const ipfsResults = document.getElementById("ipfsResults")

  // Variables to store file information
  let currentFilePath = null
  let isEligible = false
  let currentPlagiarismResults = null
  let currentTrustScoreResults = null
  let originalFileName = null
  let currentStep = 1

  // Initialize progress indicator
  updateProgressIndicator(currentStep)

  // Event Listeners for Navigation
  if (backToUploadBtn) backToUploadBtn.addEventListener("click", () => navigateToStep(1))
  if (proceedToPlagiarismBtn) proceedToPlagiarismBtn.addEventListener("click", checkPlagiarism)
  if (backToEligibilityBtn) backToEligibilityBtn.addEventListener("click", () => navigateToStep(2))
  if (proceedToTrustScoreBtn) proceedToTrustScoreBtn.addEventListener("click", calculateTrustScore)
  if (backToPlagiarismBtn) backToPlagiarismBtn.addEventListener("click", () => navigateToStep(3))
  if (proceedToUploadBtn) proceedToUploadBtn.addEventListener("click", uploadPaper)
  if (backToTrustScoreBtn) backToTrustScoreBtn.addEventListener("click", () => navigateToStep(4))
  if (proceedToIPFSBtn) proceedToIPFSBtn.addEventListener("click", uploadPaper)
  if (startNewAnalysisBtn) startNewAnalysisBtn.addEventListener("click", resetAnalysis)

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (!fileInput.files[0]) {
      alert("Please select a PDF file to analyze")
      return
    }

    // Store the original file name
    originalFileName = fileInput.files[0].name

    const formData = new FormData()
    formData.append("pdf", fileInput.files[0])

    // Show loading indicator
    loadingIndicator.classList.remove("hidden")

    try {
      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Unknown error occurred")
      }

      // Store file path for plagiarism check
      currentFilePath = data.data.fileName

      // Display eligibility status
      isEligible = data.data.eligibility.eligible
      eligibilityStatus.textContent = isEligible ? "Eligible" : "Not Eligible"
      eligibilityStatus.className = isEligible ? "eligible" : "not-eligible"

      // Display Level 0 results
      displayLevelResults(level0, data.data.eligibility.level0, "issues")

      // Display Level 1 results
      displayLevelResults(level1, data.data.eligibility.level1, "issues")

      // Display Level 2 results
      displayLevelResults(level2, data.data.eligibility.level2, "missingSections", "Missing sections:")

      // Display metadata
      displayMetadata(data.data.eligibility.metadata)

      // Enable/disable plagiarism button based on eligibility
      proceedToPlagiarismBtn.disabled = !isEligible

      // Navigate to eligibility section
      navigateToStep(2)
    } catch (error) {
      console.error("Error:", error)
      alert(`An error occurred during analysis: ${error.message}`)
    } finally {
      // Always hide loading indicator when done
      loadingIndicator.classList.add("hidden")
    }
  })

  // Function to navigate between steps
  function navigateToStep(step) {
    // Hide all sections
    const sections = document.querySelectorAll(".section-container")
    sections.forEach((section) => section.classList.remove("active-section"))

    // Show the selected section
    switch (step) {
      case 1:
        uploadSection.classList.add("active-section")
        break
      case 2:
        eligibilitySection.classList.add("active-section")
        break
      case 3:
        plagiarismSection.classList.add("active-section")
        break
      case 4:
        trustScoreSection.classList.add("active-section")
        break
      case 5:
        repositorySection.classList.add("active-section")
        break
      case 6:
        ipfsSection.classList.add("active-section")
        break
    }

    // Update progress indicator
    currentStep = step
    updateProgressIndicator(step)
  }

  // Function to update progress indicator
  function updateProgressIndicator(step) {
    // Update progress bar width
    const progressPercentage = ((step - 1) / 5) * 100
    progressIndicator.style.width = `${progressPercentage}%`

    // Update step indicators
    steps.forEach((stepEl) => {
      const stepNumber = Number.parseInt(stepEl.getAttribute("data-step"))
      stepEl.classList.remove("active", "completed")

      if (stepNumber === step) {
        stepEl.classList.add("active")
      } else if (stepNumber < step) {
        stepEl.classList.add("completed")
      }
    })
  }

  // Function to reset the analysis
  function resetAnalysis() {
    // Reset form
    form.reset()

    // Reset variables
    currentFilePath = null
    isEligible = false
    currentPlagiarismResults = null
    currentTrustScoreResults = null
    originalFileName = null

    // Clear results
    plagiarismResults.innerHTML = ""
    trustScoreResults.innerHTML = ""
    uploadResults.innerHTML = ""
    ipfsResults.innerHTML = ""

    // Navigate to first step
    navigateToStep(1)
  }

  // Function to display level results
  function displayLevelResults(element, levelData, issuesKey, issuesLabel = "Issues:") {
    const statusIndicator = element.querySelector(".status-indicator")
    const issuesElement = element.querySelector(".issues")

    // Set status indicator
    statusIndicator.className = "status-indicator " + (levelData.passed ? "status-passed" : "status-failed")

    // Display issues if any
    if (levelData[issuesKey] && levelData[issuesKey].length > 0) {
      const issuesList = document.createElement("ul")
      levelData[issuesKey].forEach((issue) => {
        const li = document.createElement("li")
        li.textContent = issue
        issuesList.appendChild(li)
      })

      issuesElement.innerHTML = `<p>${issuesLabel}</p>`
      issuesElement.appendChild(issuesList)
    } else {
      issuesElement.innerHTML = levelData.passed ? "<p>All checks passed</p>" : "<p>No specific issues found</p>"
    }
  }

  function displayMetadata(metadata) {
    metadataList.innerHTML = ""

    if (metadata) {
      const items = [
        { label: "Page Count", value: metadata.pageCount },
        { label: "Text Length", value: `${metadata.textLength} characters` },
        { label: "Scanned Document", value: metadata.isScanned ? "Yes" : "No" },
      ]

      items.forEach((item) => {
        const li = document.createElement("li")
        li.innerHTML = `<strong>${item.label}:</strong> ${item.value}`
        metadataList.appendChild(li)
      })
    }
  }

  // Function to check plagiarism
  async function checkPlagiarism() {
    if (!currentFilePath) {
      alert("No file available for plagiarism check")
      return
    }

    // Show loading indicator
    loadingIndicator.classList.remove("hidden")

    try {
      console.log("Sending plagiarism check request for file:", currentFilePath)

      const requestBody = { filePath: currentFilePath }
      console.log("Request body:", JSON.stringify(requestBody))

      const response = await fetch("/api/check-plagiarism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Plagiarism check failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (!data.success) {
        throw new Error(data.error || "Unknown error occurred")
      }

      // Store plagiarism results for trust score calculation
      currentPlagiarismResults = data.data

      // Display the plagiarism results
      displayPlagiarismResults(data.data)

      // Navigate to plagiarism section
      navigateToStep(3)
    } catch (error) {
      console.error("Error:", error)
      alert(`An error occurred during plagiarism check: ${error.message}`)
    } finally {
      // Hide loading indicator
      loadingIndicator.classList.add("hidden")
    }
  }

  // Function to calculate trust score
  async function calculateTrustScore() {
    if (!currentFilePath || !currentPlagiarismResults) {
      alert("Plagiarism check must be completed before calculating trust score")
      return
    }

    // Show loading indicator
    loadingIndicator.classList.remove("hidden")

    try {
      console.log("Sending trust score request for file:", currentFilePath)

      const requestBody = {
        filePath: currentFilePath,
        plagiarismResults: currentPlagiarismResults,
      }
      console.log("Request body:", JSON.stringify(requestBody))

      const response = await fetch("/api/trust-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Trust score calculation failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (!data.success) {
        throw new Error(data.error || "Unknown error occurred")
      }

      // Store trust score results for paper upload
      currentTrustScoreResults = data.data

      // Display the trust score results
      displayTrustScoreResults(data.data)

      // Navigate to trust score section
      navigateToStep(4)
    } catch (error) {
      console.error("Error:", error)
      alert(`An error occurred during trust score calculation: ${error.message}`)
    } finally {
      // Hide loading indicator
      loadingIndicator.classList.add("hidden")
    }
  }

  // Function to upload paper
  async function uploadPaper() {
    if (!currentFilePath || !currentPlagiarismResults || !currentTrustScoreResults) {
      alert("Trust score calculation must be completed before uploading the paper")
      return
    }

    // Show loading indicator
    loadingIndicator.classList.remove("hidden")

    try {
      console.log("Sending paper upload request for file:", currentFilePath)

      // Prepare metadata for the paper
      const metadata = {
        originalFileName,
        trustScore: currentTrustScoreResults.trustScore,
        trustLevel: currentTrustScoreResults.trustLevel,
        plagiarismScore: currentPlagiarismResults.summary.overallScore,
        plagiarismRisk: currentPlagiarismResults.summary.plagiarismRisk,
        aiDetectionScore: currentTrustScoreResults.components.aiGenerated.score,
        aiVerdict: currentTrustScoreResults.components.aiGenerated.details.verdict,
      }

      const requestBody = {
        filePath: currentFilePath,
        metadata,
      }
      console.log("Request body:", JSON.stringify(requestBody))

      const response = await fetch("/api/upload-paper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Paper upload failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (!data.success) {
        throw new Error(data.error || "Unknown error occurred")
      }

      // Display the upload results as IPFS results
      displayIPFSResults({
        cid: data.data.cid || "CID-placeholder-" + Date.now(),
        url: data.data.url || `https://gateway.pinata.cloud/ipfs/${data.data.cid || "CID-placeholder-" + Date.now()}`,
        timestamp: data.data.timestamp || new Date().toISOString(),
      })

      // Navigate to IPFS section
      navigateToStep(6)
    } catch (error) {
      console.error("Error:", error)
      alert(`An error occurred during paper upload: ${error.message}`)
    } finally {
      // Hide loading indicator
      loadingIndicator.classList.add("hidden")
    }
  }

  // Function to upload to IPFS
  async function uploadToIPFS() {
    if (!currentFilePath) {
      alert("No file available for IPFS upload")
      return
    }

    // Show loading indicator
    loadingIndicator.classList.remove("hidden")

    try {
      console.log("Sending IPFS upload request for file:", currentFilePath)

      const requestBody = { filePath: currentFilePath }
      console.log("Request body:", JSON.stringify(requestBody))

      const response = await fetch("/api/upload-to-ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`IPFS upload failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (!data.success) {
        throw new Error(data.error || "Unknown error occurred")
      }

      // Display the IPFS upload results
      displayIPFSResults(data.data)

      // Navigate to IPFS section
      navigateToStep(6)
    } catch (error) {
      console.error("Error:", error)
      alert(`An error occurred during IPFS upload: ${error.message}`)
    } finally {
      // Hide loading indicator
      loadingIndicator.classList.add("hidden")
    }
  }

  // Function to display plagiarism results
  function displayPlagiarismResults(results) {
    // Clear previous results
    plagiarismResults.innerHTML = ""

    // Determine the color based on the risk level and score
    let riskColor
    const score = results.summary.overallScore

    if (score < 50) {
      // Heavily plagiarized - Red
      riskColor = "#dc3545"
    } else if (score < 70) {
      // Medium plagiarism - Orange
      riskColor = "#fd7e14"
    } else if (score < 85) {
      // Low-medium plagiarism - Yellow
      riskColor = "#ffc107"
    } else {
      // Low plagiarism - Green
      riskColor = "#28a745"
    }

    // Create the summary section
    const summary = document.createElement("div")
    summary.className = "plagiarism-summary"

    summary.innerHTML = `
      <h3>Plagiarism Check Results</h3>
      <div class="score-container" style="display: flex; align-items: center; margin-bottom: 15px;">
        <div class="score-circle" style="width: 80px; height: 80px; border-radius: 50%; background-color: ${riskColor}; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
          <span style="color: white; font-size: 24px; font-weight: bold;">${results.summary.overallScore}%</span>
        </div>
        <div class="score-details">
          <p><strong>Risk Level:</strong> ${results.summary.plagiarismRisk}</p>
          <p><strong>Analyzed Sections:</strong> ${results.summary.analyzedSections.length}</p>
        </div>
      </div>
    `

    // Create the detailed results section
    const detailedResults = document.createElement("div")
    detailedResults.className = "plagiarism-detailed-results"

    // Add a heading for the detailed results
    const detailedHeading = document.createElement("h4")
    detailedHeading.textContent = "Section Analysis"
    detailedResults.appendChild(detailedHeading)

    // Create a table for the section scores
    const table = document.createElement("table")
    table.style.width = "100%"
    table.style.borderCollapse = "collapse"
    table.style.marginBottom = "20px"

    // Add table header
    const thead = document.createElement("thead")
    thead.innerHTML = `
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Section</th>
        <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Score</th>
        <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Flagged Content</th>
      </tr>
    `
    table.appendChild(thead)

    // Add table body
    const tbody = document.createElement("tbody")
    results.detailedResults.forEach((section) => {
      const row = document.createElement("tr")

      // Determine the color based on the section score
      let sectionColor
      if (section.score < 50) {
        // Heavily plagiarized - Red
        sectionColor = "#dc3545"
      } else if (section.score < 70) {
        // Medium plagiarism - Orange
        sectionColor = "#fd7e14"
      } else if (section.score < 85) {
        // Low-medium plagiarism - Yellow
        sectionColor = "#ffc107"
      } else {
        // Low plagiarism - Green
        sectionColor = "#28a745"
      }

      row.innerHTML = `
        <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${section.section.charAt(0).toUpperCase() + section.section.slice(1)}</td>
        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd; color: ${sectionColor}; font-weight: bold;">${section.score}%</td>
        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${section.flaggedCount}</td>
      `
      tbody.appendChild(row)
    })
    table.appendChild(tbody)
    detailedResults.appendChild(table)

    // Add examples of flagged content if any
    const flaggedExamples = results.detailedResults.flatMap((section) =>
      section.examples.map((example) => ({
        section: section.section,
        ...example,
      })),
    )

    if (flaggedExamples.length > 0) {
      const examplesHeading = document.createElement("h4")
      examplesHeading.textContent = "Examples of Potentially Unoriginal Content"
      detailedResults.appendChild(examplesHeading)

      const examplesList = document.createElement("ul")
      examplesList.style.paddingLeft = "20px"

      flaggedExamples.forEach((example) => {
        const li = document.createElement("li")
        li.style.marginBottom = "10px"

        // Create source link if available
        const sourceLink = example.sourceUrl
          ? `<a href="${example.sourceUrl}" target="_blank">${example.potentialSource}</a>`
          : example.potentialSource

        li.innerHTML = `
          <p><strong>Section:</strong> ${example.section.charAt(0).toUpperCase() + example.section.slice(1)}</p>
          <p><strong>Content:</strong> "${example.sentence}"</p>
          <p><strong>Similarity:</strong> ${Math.round(example.similarity * 100)}%</p>
          <p><strong>Potential Source:</strong> ${sourceLink}</p>
        `
        examplesList.appendChild(li)
      })

      detailedResults.appendChild(examplesList)
    }

    // Add recommendations if any
    if (results.recommendations && results.recommendations.length > 0) {
      const recommendationsHeading = document.createElement("h4")
      recommendationsHeading.textContent = "Recommendations"
      detailedResults.appendChild(recommendationsHeading)

      const recommendationsList = document.createElement("ul")
      recommendationsList.style.paddingLeft = "20px"

      results.recommendations.forEach((recommendation) => {
        const li = document.createElement("li")
        li.style.marginBottom = "10px"
        li.innerHTML = `
          <p><strong>Section:</strong> ${recommendation.section.charAt(0).toUpperCase() + recommendation.section.slice(1)}</p>
          <p><strong>Advice:</strong> ${recommendation.advice}</p>
        `
        recommendationsList.appendChild(li)
      })

      detailedResults.appendChild(recommendationsList)
    }

    // Add the summary and detailed results to the container
    plagiarismResults.appendChild(summary)
    plagiarismResults.appendChild(detailedResults)
  }

  // Function to display trust score results
  function displayTrustScoreResults(results) {
    // Clear previous results
    trustScoreResults.innerHTML = ""

    // Determine the color based on the trust level
    let trustColor
    if (results.trustLevel === "High") {
      trustColor = "#28a745" // Green
    } else if (results.trustLevel === "Moderate") {
      trustColor = "#ffc107" // Yellow
    } else if (results.trustLevel === "Low") {
      trustColor = "#fd7e14" // Orange
    } else {
      trustColor = "#dc3545" // Red
    }

    // Create the summary section
    const summary = document.createElement("div")
    summary.className = "trust-score-summary"
    summary.style.marginBottom = "20px"
    summary.style.paddingBottom = "15px"
    summary.style.borderBottom = "1px solid #ddd"

    summary.innerHTML = `
      <h3>Trust Score Analysis</h3>
      <div class="score-container" style="display: flex; align-items: center; margin-bottom: 15px;">
        <div class="score-circle" style="width: 80px; height: 80px; border-radius: 50%; background-color: ${trustColor}; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
          <span style="color: white; font-size: 24px; font-weight: bold;">${results.trustScore}%</span>
        </div>
        <div class="score-details">
          <p><strong>Trust Level:</strong> ${results.trustLevel}</p>
          <p><strong>Components:</strong> Plagiarism (${results.components.plagiarism.weight * 100}%), AI Detection (${results.components.aiGenerated.weight * 100}%)</p>
        </div>
      </div>
    `

    // Create the components section
    const components = document.createElement("div")
    components.className = "trust-score-components"
    components.style.marginBottom = "20px"

    // Create a table for the component scores
    const table = document.createElement("table")
    table.style.width = "100%"
    table.style.borderCollapse = "collapse"
    table.style.marginBottom = "20px"

    // Add table header
    const thead = document.createElement("thead")
    thead.innerHTML = `
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Component</th>
        <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Score</th>
        <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Weight</th>
        <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Contribution</th>
      </tr>
    `
    table.appendChild(thead)

    // Add table body
    const tbody = document.createElement("tbody")

    // Plagiarism row
    const plagiarismRow = document.createElement("tr")
    let plagiarismColor
    if (results.components.plagiarism.score < 50) {
      plagiarismColor = "#dc3545" // Red
    } else if (results.components.plagiarism.score < 70) {
      plagiarismColor = "#fd7e14" // Orange
    } else if (results.components.plagiarism.score < 85) {
      plagiarismColor = "#ffc107" // Yellow
    } else {
      plagiarismColor = "#28a745" // Green
    }

    plagiarismRow.innerHTML = `
      <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Originality (Plagiarism Check)</td>
      <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd; color: ${plagiarismColor}; font-weight: bold;">${results.components.plagiarism.score}%</td>
      <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${results.components.plagiarism.weight * 100}%</td>
      <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${results.components.plagiarism.contribution}</td>
    `
    tbody.appendChild(plagiarismRow)

    // AI Detection row
    const aiRow = document.createElement("tr")
    let aiColor
    if (results.components.aiGenerated.score < 50) {
      aiColor = "#dc3545" // Red
    } else if (results.components.aiGenerated.score < 70) {
      aiColor = "#fd7e14" // Orange
    } else if (results.components.aiGenerated.score < 85) {
      aiColor = "#ffc107" // Yellow
    } else {
      aiColor = "#28a745" // Green
    }

    aiRow.innerHTML = `
      <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Authenticity (AI Detection)</td>
      <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd; color: ${aiColor}; font-weight: bold;">${results.components.aiGenerated.score}%</td>
      <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${results.components.aiGenerated.weight * 100}%</td>
      <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${results.components.aiGenerated.contribution}</td>
    `
    tbody.appendChild(aiRow)

    table.appendChild(tbody)
    components.appendChild(table)

    // Add AI detection details
    const aiDetails = document.createElement("div")
    aiDetails.className = "ai-detection-details"
    aiDetails.style.marginBottom = "20px"

    const aiDetailsHeading = document.createElement("h4")
    aiDetailsHeading.textContent = "AI Content Detection Details"
    aiDetails.appendChild(aiDetailsHeading)

    const aiVerdict = document.createElement("p")
    aiVerdict.innerHTML = `<strong>Verdict:</strong> ${results.components.aiGenerated.details.verdict.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
    aiDetails.appendChild(aiVerdict)

    const aiProbability = document.createElement("p")
    aiProbability.innerHTML = `<strong>AI Probability:</strong> ${Math.round(results.components.aiGenerated.details.aiProbability * 100)}%`
    aiDetails.appendChild(aiProbability)

    // Add flagged sections if any
    if (results.components.aiGenerated.details.flags.highConfidenceAI > 0) {
      const flaggedSections = document.createElement("div")
      flaggedSections.style.marginTop = "10px"

      const flaggedHeading = document.createElement("p")
      flaggedHeading.innerHTML = `<strong>Flagged Sections:</strong> ${results.components.aiGenerated.details.flags.highConfidenceAI}`
      flaggedSections.appendChild(flaggedHeading)

      if (results.components.aiGenerated.details.flags.sampleSections.length > 0) {
        const samplesList = document.createElement("ul")
        samplesList.style.paddingLeft = "20px"

        results.components.aiGenerated.details.flags.sampleSections.forEach((sample) => {
          const li = document.createElement("li")
          li.style.marginBottom = "10px"
          li.innerHTML = `
            <p><strong>AI Score:</strong> ${Math.round(sample.score * 100)}%</p>
            <p><strong>Preview:</strong> "${sample.preview}"</p>
          `
          samplesList.appendChild(li)
        })

        flaggedSections.appendChild(samplesList)
      }

      aiDetails.appendChild(flaggedSections)
    }

    // Add recommendations if any
    if (results.recommendations && results.recommendations.length > 0) {
      const recommendationsSection = document.createElement("div")
      recommendationsSection.className = "trust-score-recommendations"

      const recommendationsHeading = document.createElement("h4")
      recommendationsHeading.textContent = "Recommendations"
      recommendationsSection.appendChild(recommendationsHeading)

      const recommendationsList = document.createElement("ul")
      recommendationsList.style.paddingLeft = "20px"

      results.recommendations.forEach((recommendation) => {
        const li = document.createElement("li")
        li.style.marginBottom = "10px"
        li.innerHTML = `
          <p><strong>Area:</strong> ${recommendation.area}</p>
          <p><strong>Issue:</strong> ${recommendation.issue}</p>
          <p><strong>Action:</strong> ${recommendation.action}</p>
        `
        recommendationsList.appendChild(li)
      })

      recommendationsSection.appendChild(recommendationsList)

      // Add all sections to the container
      trustScoreResults.appendChild(summary)
      trustScoreResults.appendChild(components)
      trustScoreResults.appendChild(aiDetails)
      trustScoreResults.appendChild(recommendationsSection)
    } else {
      // Add sections without recommendations
      trustScoreResults.appendChild(summary)
      trustScoreResults.appendChild(components)
      trustScoreResults.appendChild(aiDetails)
    }
  }

  // Function to display IPFS upload results
  function displayIPFSResults(results) {
    // Clear previous results
    ipfsResults.innerHTML = ""

    // Create the content
    ipfsResults.innerHTML = `
    <div class="ipfs-results">
      <h3>Paper Uploaded to Repository Successfully</h3>
      <p>Your paper has been permanently stored on the IPFS network and is now available worldwide.</p>
      <p><strong>Content ID (CID):</strong> <span class="ipfs-cid">${results.cid}</span></p>
      <p><strong>Timestamp:</strong> ${new Date(results.timestamp).toLocaleString()}</p>
      <p>
        <a href="${results.url}" target="_blank" class="ipfs-link">View on IPFS Gateway</a>
      </p>
      <p>Your paper is now immutably stored on the decentralized web and can be accessed by anyone with the CID.</p>
    </div>
  `
  }
})

