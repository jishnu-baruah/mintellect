"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Search, Filter, Upload, Plus, X, RotateCcw, Trash2, Play, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Download, Eye, Shield, Target } from "lucide-react"
import { RippleButton } from "@/components/ui/ripple-button"
import { GlassCard } from "@/components/ui/glass-card"
import Link from "next/link"
import { workflowPersistence, type WorkflowState } from "@/lib/workflow-persistence"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowState | null>(null)
  const [archivedWorkflows, setArchivedWorkflows] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [selectedArchive, setSelectedArchive] = useState<any>(null)
  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<string>>(new Set())
  // Store formatted dates for workflows
  const [formattedDates, setFormattedDates] = useState<{[id: string]: string}>({});
  // Loading states for downloads
  const [downloadingPlagiarismReport, setDownloadingPlagiarismReport] = useState<string | null>(null)
  const [downloadingTrustScoreReport, setDownloadingTrustScoreReport] = useState<string | null>(null)

  const router = useRouter();
  const { toast } = useToast();

  const getWorkflowStatus = (workflow: WorkflowState | null) => {
    if (!workflow) return 'none'
    
    if (workflow.nftMintingData) return 'completed'
    if (workflow.humanReviewData) return 'review'
    if (workflow.trustScoreData) return 'trust_score'
    if (workflow.plagiarismResult) return 'plagiarism'
    if (workflow.eligible) return 'eligible'
    return 'uploaded'
  }

  // Helper function to extract file size from workflow
  const getFileSize = (workflow: any) => {
    if (workflow.documentFile?.size) {
      return `${(workflow.documentFile.size / 1024 / 1024).toFixed(2)} MB`
    }
    return 'Unknown'
  }

  // Helper function to extract plagiarism data
  const getPlagiarismData = (workflow: any) => {
    if (!workflow.plagiarismResult) return null
    
    // Handle different plagiarism result structures
    let plagiarismScore = 0
    let originalityScore = 100
    let matchesCount = 0
    let sources = []
    
    if (workflow.plagiarismResult.data) {
      // PlagiarismSearch API structure
      plagiarismScore = workflow.plagiarismResult.data.plagiarism || workflow.plagiarismResult.data.similarity || 0
      originalityScore = workflow.plagiarismResult.data.originality || (100 - plagiarismScore)
      matchesCount = workflow.plagiarismResult.data.files?.length || 0
      sources = workflow.plagiarismResult.data.files || []
    } else if (workflow.plagiarismResult.plagiarism !== undefined) {
      // Direct structure
      plagiarismScore = workflow.plagiarismResult.plagiarism
      originalityScore = workflow.plagiarismResult.originality || (100 - plagiarismScore)
      matchesCount = workflow.plagiarismResult.matches?.length || 0
      sources = workflow.plagiarismResult.matches || []
    } else if (workflow.plagiarismResult.summary) {
      // Summary structure
      plagiarismScore = workflow.plagiarismResult.summary.overallScore || 0
      originalityScore = workflow.plagiarismResult.summary.originalityScore || (100 - plagiarismScore)
      matchesCount = workflow.plagiarismResult.sources?.length || 0
      sources = workflow.plagiarismResult.sources || []
    }
    
    // Clean up sources to ensure they have proper structure
    const cleanSources = sources.map((source: any, index: number) => {
      if (typeof source === 'string') {
        return {
          url: source,
          title: `Source ${index + 1}`,
          similarity: 0
        }
      } else if (source && typeof source === 'object') {
        return {
          url: source.url || source.link || '',
          title: source.title || source.name || `Source ${index + 1}`,
          similarity: source.similarity || source.score || 0
        }
      }
      return {
        url: '',
        title: `Source ${index + 1}`,
        similarity: 0
      }
    }).filter((source: any) => source.url && source.url.trim() !== '')
    
    return {
      plagiarismScore,
      originalityScore,
      matchesCount: cleanSources.length,
      reportId: workflow.plagiarismResult.reportId || workflow.plagiarismResult.data?.id,
      sources: cleanSources
    }
  }

  // Helper function to extract trust score data
  const getTrustScoreData = (workflow: any) => {
    if (!workflow.trustScoreData) return null
    
    let overallScore = 0
    let trustLevel = 'Unknown'
    let breakdown: any = {
      plagiarism: { score: 0, weight: 0, contribution: 0, description: '' },
      aiDetection: { score: 0, weight: 0, contribution: 0, description: '' },
      academicQuality: { score: 0, weight: 0, contribution: 0, description: '' },
      methodology: { score: 0, weight: 0, contribution: 0, description: '' },
      citations: { score: 0, weight: 0, contribution: 0, description: '' }
    }
    let aiAnalysis: any = {
      aiProbability: 0,
      humanWrittenProbability: 0,
      academicQuality: 0,
      methodologyScore: 0,
      citationQuality: 0,
      originalityScore: 0,
      confidence: 0,
      classification: '',
      analysis: '',
      flags: [],
      recommendations: []
    }
    
    if (workflow.trustScoreData.trustScore !== undefined) {
      // New API structure
      overallScore = workflow.trustScoreData.trustScore
      trustLevel = workflow.trustScoreData.trustLevel || 'Unknown'
      breakdown = workflow.trustScoreData.breakdown?.components || breakdown
      aiAnalysis = workflow.trustScoreData.aiAnalysis || aiAnalysis
    } else if (workflow.trustScoreData.overallScore !== undefined) {
      // Legacy structure
      overallScore = workflow.trustScoreData.overallScore
      breakdown = workflow.trustScoreData.breakdown || breakdown
    } else if (workflow.trustScoreData.data) {
      // Nested data structure
      overallScore = workflow.trustScoreData.data.trustScore || workflow.trustScoreData.data.overallScore || 0
      trustLevel = workflow.trustScoreData.data.trustLevel || 'Unknown'
      breakdown = workflow.trustScoreData.data.breakdown?.components || breakdown
      aiAnalysis = workflow.trustScoreData.data.aiAnalysis || aiAnalysis
    }
    
    // Convert decimal values to percentages (0-1 to 0-100)
    const convertToPercentage = (value: number) => {
      if (value <= 1) return Math.round(value * 100)
      return Math.round(value)
    }
    
    // Convert breakdown scores to percentages
    Object.keys(breakdown).forEach(key => {
      if (breakdown[key] && typeof breakdown[key].score === 'number') {
        breakdown[key].score = convertToPercentage(breakdown[key].score)
      }
    })
    
    // Convert AI analysis scores to percentages
    Object.keys(aiAnalysis).forEach(key => {
      if (typeof aiAnalysis[key] === 'number' && key !== 'confidence') {
        aiAnalysis[key] = convertToPercentage(aiAnalysis[key])
      }
    })
    
    // Convert confidence to percentage
    if (typeof aiAnalysis.confidence === 'number') {
      aiAnalysis.confidence = convertToPercentage(aiAnalysis.confidence)
    }
    
    return {
      overallScore: convertToPercentage(overallScore),
      trustLevel,
      breakdown,
      aiAnalysis,
      recommendations: workflow.trustScoreData.recommendations || []
    }
  }

  // Load current workflow and archived workflows
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        setIsLoading(true)
        
        // Get current workflow from localStorage
        const current = workflowPersistence.getWorkflowState()
        setCurrentWorkflow(current)
        
        // Get archived workflows
        const archives = await workflowPersistence.getArchivedWorkflows()
        setArchivedWorkflows(archives)
      } catch (error) {
        console.error('Failed to load workflows:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadWorkflows()
  }, []) // Only run once on mount

  // Memoize allWorkflows to prevent infinite loops
  const allWorkflows = useMemo(() => [
    ...(currentWorkflow ? [{
      ...currentWorkflow,
      isCurrent: true,
      status: getWorkflowStatus(currentWorkflow),
      lastUpdated: currentWorkflow.updatedAt,
    }] : []),
    ...archivedWorkflows
      .filter(archive => !currentWorkflow || archive.documentId !== currentWorkflow.documentId)
      .map(archive => ({
        ...archive,
        isCurrent: false,
        lastUpdated: archive.updatedAt,
      }))
  ], [currentWorkflow, archivedWorkflows]);

  // Format dates for all workflows after mount (hydration-safe)
  useEffect(() => {
    const dates: {[id: string]: string} = {};
    allWorkflows.forEach((workflow, index) => {
      const id = workflow.documentId || `workflow-${index}`;
      if (workflow.lastUpdated) {
        dates[id] = new Date(workflow.lastUpdated).toLocaleDateString();
      }
    });
    setFormattedDates(dates);
  }, [currentWorkflow, archivedWorkflows]);

  const filteredWorkflows = allWorkflows.filter((workflow) => {
    const matchesSearch = workflow.documentName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus ? workflow.status === selectedStatus : true
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'review':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'trust_score':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'plagiarism':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'eligible':
        return <Clock className="h-4 w-4 text-purple-500" />
      case 'uploaded':
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'review':
        return 'Under Review'
      case 'trust_score':
        return 'Trust Score Generated'
      case 'plagiarism':
        return 'Plagiarism Checked'
      case 'eligible':
        return 'Eligible'
      case 'uploaded':
        return 'Uploaded'
      default:
        return 'Unknown'
    }
  }

  const toggleWorkflowExpansion = (workflowId: string) => {
    setExpandedWorkflows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(workflowId)) {
        newSet.delete(workflowId)
      } else {
        newSet.add(workflowId)
      }
      return newSet
    })
  }

  const handleResumeWorkflow = async (workflow: any) => {
    try {
      if (workflow.isCurrent) {
        // Resume current workflow
        router.push('/workflow')
      } else {
        // Resume archived workflow
        setSelectedArchive(workflow)
        setShowResumeModal(true)
      }
    } catch (error) {
      console.error('Failed to resume workflow:', error)
    }
  }

  const handleDeleteWorkflow = async (workflow: any) => {
    try {
      if (workflow.isCurrent) {
        // Clear current workflow
        workflowPersistence.clearWorkflowState()
        setCurrentWorkflow(null)
      } else {
        // Delete archived workflow
        await workflowPersistence.deleteArchivedWorkflow(workflow.archiveUrl)
        setArchivedWorkflows(prev => prev.filter(w => w.archiveUrl !== workflow.archiveUrl))
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error)
    }
  }

  const handleResumeFromArchive = async () => {
    if (!selectedArchive) return
    
    try {
      const resumedState = await workflowPersistence.resumeWorkflow(selectedArchive.archiveUrl)
      console.log('handleResumeFromArchive: resumedState', resumedState)
      if (resumedState) {
        // Navigate to workflow page (client-side)
        console.log('Navigating to /workflow after resume')
        router.push('/workflow')
      }
    } catch (error) {
      console.error('Failed to resume from archive:', error)
    }
  }

  const downloadPlagiarismReport = async (workflow: any) => {
    if (!workflow.plagiarismResult) {
      console.error('No plagiarism data available')
      return
    }

    const workflowId = workflow.documentId || 'unknown'
    setDownloadingPlagiarismReport(workflowId)

    // Parse the data the same way as PlagiarismReportViewer
    const parsePlagiarismData = () => {
      let data = workflow.plagiarismResult
      
      // If data is nested in a 'data' field (PlagiarismSearch API response)
      if (workflow.plagiarismResult.data && typeof workflow.plagiarismResult.data === 'object') {
        data = workflow.plagiarismResult.data
      }
      
      return {
        plagiarismScore: data.plagiarism || data.similarity || data.plagiat || 0,
        originalityScore: data.originality || (100 - (data.plagiarism || data.similarity || data.plagiat || 0)),
        reportId: data.id || workflow.plagiarismResult.reportId
      }
    }

    // Get unique sources the same way as PlagiarismReportViewer
    const getUniqueSources = (sources: any[]) => {
      return sources.map((source: any) => ({
        name: source.title || source.url || 'Unknown Source',
        url: source.url || '',
        similarity: source.plagiarism || 0,
        count: source.count || 1,
        matches: source.matches || 0,
        matchedWords: source.matched_words || 0
      })).sort((a: any, b: any) => b.similarity - a.similarity)
    }

    try {
      console.log('Plagiarism workflow data:', workflow.plagiarismResult)
      
      const parsedData = parsePlagiarismData()
      console.log('Parsed plagiarism data:', parsedData)
      
      // Fetch sources from the API like PlagiarismReportViewer does
      let sources = []
      if (parsedData.reportId) {
        try {
          console.log('Fetching sources from API for report ID:', parsedData.reportId)
          const sourcesResponse = await fetch(`http://localhost:8000/reports/sources/${parsedData.reportId}`)
          if (sourcesResponse.ok) {
            const sourcesData = await sourcesResponse.json()
            if (sourcesData.data?.sources) {
              sources = sourcesData.data.sources
              console.log('Fetched sources from API:', sources)
            }
          }
        } catch (error) {
          console.error('Failed to fetch sources from API:', error)
        }
      }
      
      const uniqueSources = getUniqueSources(sources)
      console.log('Unique sources:', uniqueSources)

      const requestBody = {
        plagiarismData: {
          plagiarism: parsedData.plagiarismScore,
          originality: parsedData.originalityScore
        },
        documentName: workflow.documentName || 'Document',
        sources: uniqueSources
      }
      
      console.log('Sending request to server:', requestBody)

      // Use the new S3 PDF generation endpoint
      const response = await fetch('http://localhost:5000/api/pdf/generate-plagiarism-report-s3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Server response:', result)
        
        if (result.success && result.downloadUrl) {
          // Open the S3 presigned URL in a new tab
          window.open(result.downloadUrl, '_blank')
          
          toast({
            title: "Report Generated Successfully",
            description: "Your plagiarism report has been generated and opened in a new tab. The file will download automatically.",
          })
        } else {
          console.error('Failed to generate report:', result)
          // Try fallback to local endpoint
          await downloadPlagiarismReportLocal(workflow, parsedData, uniqueSources)
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to download report:', errorData)
        // Try fallback to local endpoint
        await downloadPlagiarismReportLocal(workflow, parsedData, uniqueSources)
      }
    } catch (error) {
      console.error('Error downloading report:', error)
      // Try fallback to local endpoint
      const parsedData = parsePlagiarismData()
      const uniqueSources = getUniqueSources([])
      if (parsedData) {
        await downloadPlagiarismReportLocal(workflow, parsedData, uniqueSources)
      }
    } finally {
      setDownloadingPlagiarismReport(null)
    }
  }

  const downloadPlagiarismReportLocal = async (workflow: any, parsedData: any, uniqueSources: any[]) => {
    try {
      console.log('Trying local PDF generation as fallback...')
      
      const response = await fetch('http://localhost:5000/api/pdf/generate-plagiarism-report-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plagiarismData: {
            plagiarism: parsedData.plagiarismScore,
            originality: parsedData.originalityScore
          },
          documentName: workflow.documentName || 'Document',
          sources: uniqueSources
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Local PDF generation result:', result)
        
        if (result.success) {
          // For local generation, we can't provide a direct download link
          // but we can show a success message
          alert('PDF generated successfully! Check the server logs for the file location.')
        }
      } else {
        console.error('Local PDF generation also failed')
      }
    } catch (error) {
      console.error('Error with local PDF generation:', error)
    }
  }

  const downloadTrustScoreReport = async (workflow: any) => {
    if (!workflow.trustScoreData) {
      console.error('No trust score data available')
      return
    }

    const workflowId = workflow.documentId || 'unknown'
    setDownloadingTrustScoreReport(workflowId)

    try {
      // Use the new S3 PDF generation endpoint for trust score reports
      const response = await fetch('http://localhost:5000/api/pdf/generate-trust-score-report-s3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trustScoreData: workflow.trustScoreData,
          documentName: workflow.documentName || 'Document',
          plagiarismData: workflow.plagiarismResult
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.downloadUrl) {
          // Open the S3 presigned URL in a new tab
          window.open(result.downloadUrl, '_blank')
          
          toast({
            title: "Trust Score Report Generated Successfully",
            description: "Your trust score report has been generated and opened in a new tab. The file will download automatically.",
          })
        } else {
          console.error('Failed to generate trust score report')
        }
      } else {
        console.error('Failed to download trust score report')
      }
    } catch (error) {
      console.error('Error downloading trust score report:', error)
    } finally {
      setDownloadingTrustScoreReport(null)
    }
  }

  const getPlagiarismScoreColor = (score: number) => {
    if (score <= 20) return 'text-green-500'
    if (score <= 40) return 'text-yellow-500'
    if (score <= 60) return 'text-orange-500'
    return 'text-red-500'
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-mintellect-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <header className="relative z-10 border-b border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            Documents
          </motion.h1>
          <p className="text-gray-400 max-w-md text-sm md:text-base">
            Your verified research documents.
          </p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary transition-all w-full sm:w-auto"
                  value={selectedStatus || ""}
                  onChange={(e) => setSelectedStatus(e.target.value || null)}
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="review">Under Review</option>
                  <option value="trust_score">Trust Score Generated</option>
                  <option value="plagiarism">Plagiarism Checked</option>
                  <option value="eligible">Eligible</option>
                  <option value="uploaded">Uploaded</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all w-full sm:w-auto justify-center">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mintellect-primary mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your documents...</p>
              </div>
            </GlassCard>
          </motion.div>
        ) : filteredWorkflows.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Your Workflows</h2>
                <div className="space-y-4">
                  {filteredWorkflows.map((workflow, index) => {
                    const workflowId = workflow.documentId || `workflow-${index}`
                    const isExpanded = expandedWorkflows.has(workflowId)
                    
                    return (
                      <motion.div
                        key={workflowId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-800/30 transition-colors"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(workflow.status)}
                                <div>
                                  <h3 className="font-medium text-white">
                                    {workflow.documentName || 'Untitled Document'}
                                    {workflow.isCurrent && (
                                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                        Current
                                      </span>
                                    )}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    {getStatusText(workflow.status)} • {formattedDates[workflowId] || ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <RippleButton
                                onClick={() => toggleWorkflowExpansion(workflowId)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                Details
                              </RippleButton>
                              
                              <RippleButton
                                onClick={() => handleResumeWorkflow(workflow)}
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                {workflow.isCurrent ? <Play className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />}
                                {workflow.isCurrent ? 'Continue' : 'Resume'}
                              </RippleButton>
                              
                              <RippleButton
                                onClick={() => handleDeleteWorkflow(workflow)}
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </RippleButton>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-gray-700 bg-gray-800/20"
                            >
                              <div className="p-4 space-y-4">
                                {/* Document Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-gray-800/50 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      Document Information
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">File Name:</span>
                                        <span className="text-white">{workflow.documentName || 'Untitled'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">File Size:</span>
                                        <span className="text-white">{getFileSize(workflow)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Upload Date:</span>
                                        <span className="text-white">{formattedDates[workflowId] || ''}</span>
                                      </div>
                                      {workflow.wordCount && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Word Count:</span>
                                          <span className="text-white">{workflow.wordCount.toLocaleString()}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Eligibility Status */}
                                  <div className="bg-gray-800/50 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                      <Target className="h-4 w-4" />
                                      Eligibility Status
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Status:</span>
                                        <span className={`font-medium ${workflow.eligible ? 'text-green-500' : 'text-red-500'}`}>
                                          {workflow.eligible ? 'Eligible' : 'Not Eligible'}
                                        </span>
                                      </div>
                                      {workflow.eligibilityReason && (
                                        <div className="text-gray-400 text-xs mt-2">
                                          {workflow.eligibilityReason}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Plagiarism Results */}
                                {workflow.plagiarismResult && (
                                  <div className="bg-gray-800/50 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                      <Eye className="h-4 w-4" />
                                      Plagiarism Analysis
                                    </h4>
                                    {(() => {
                                      const plagiarismData = getPlagiarismData(workflow)
                                      if (!plagiarismData) return null
                                      
                                      return (
                                        <>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                              <div className={`text-2xl font-bold ${getPlagiarismScoreColor(plagiarismData.plagiarismScore)}`}>
                                                {plagiarismData.plagiarismScore}%
                                              </div>
                                              <div className="text-xs text-gray-400">Plagiarism Score</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-blue-500">
                                                {plagiarismData.originalityScore}%
                                              </div>
                                              <div className="text-xs text-gray-400">Originality Score</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-purple-500">
                                                {plagiarismData.matchesCount}
                                              </div>
                                              <div className="text-xs text-gray-400">Matches Found</div>
                                            </div>
                                          </div>
                                          {plagiarismData.reportId && (
                                            <div className="mt-4">
                                              <RippleButton
                                                onClick={() => downloadPlagiarismReport(workflow)}
                                                size="sm"
                                                className="flex items-center gap-2"
                                                disabled={downloadingPlagiarismReport === workflow.documentId}
                                              >
                                                {downloadingPlagiarismReport === workflow.documentId ? (
                                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                  <Download className="h-4 w-4" />
                                                )}
                                                {downloadingPlagiarismReport === workflow.documentId ? "Generating..." : "Download Report"}
                                              </RippleButton>
                                            </div>
                                          )}
                                        </>
                                      )
                                    })()}
                                  </div>
                                )}

                                {/* Trust Score Results */}
                                {workflow.trustScoreData && (
                                  <div className="bg-gray-800/50 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                      <Shield className="h-4 w-4" />
                                      Trust Score Analysis
                                    </h4>
                                    {(() => {
                                      const trustData = getTrustScoreData(workflow)
                                      if (!trustData) return null
                                      
                                      return (
                                        <>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="text-center">
                                              <div className={`text-2xl font-bold ${getTrustScoreColor(trustData.overallScore)}`}>
                                                {trustData.overallScore}/100
                                              </div>
                                              <div className="text-xs text-gray-400">Overall Trust Score</div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                              <div className="flex justify-between">
                                                <span className="text-gray-400">Plagiarism Check:</span>
                                                <span className="text-white">{trustData.breakdown.plagiarism.score}/100</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-400">AI Detection:</span>
                                                <span className="text-white">{trustData.breakdown.aiDetection.score}/100</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-400">Academic Quality:</span>
                                                <span className="text-white">{trustData.breakdown.academicQuality.score}/100</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-400">Methodology:</span>
                                                <span className="text-white">{trustData.breakdown.methodology.score}/100</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-400">Citations:</span>
                                                <span className="text-white">{trustData.breakdown.citations.score}/100</span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-sm text-gray-400 mt-4">
                                            <strong>Trust Level:</strong> {trustData.trustLevel}
                                          </div>
                                          <div className="text-sm text-gray-400">
                                            <strong>AI Analysis:</strong>
                                            <ul className="list-disc list-inside mt-2">
                                              <li><strong>AI Probability:</strong> {trustData.aiAnalysis.aiProbability}%</li>
                                              <li><strong>Human Written Probability:</strong> {trustData.aiAnalysis.humanWrittenProbability}%</li>
                                              <li><strong>Academic Quality:</strong> {trustData.aiAnalysis.academicQuality}%</li>
                                              <li><strong>Methodology Score:</strong> {trustData.aiAnalysis.methodologyScore}%</li>
                                              <li><strong>Citation Quality:</strong> {trustData.aiAnalysis.citationQuality}%</li>
                                              <li><strong>Originality Score:</strong> {trustData.aiAnalysis.originalityScore}%</li>
                                              <li><strong>Confidence:</strong> {trustData.aiAnalysis.confidence}%</li>
                                              <li><strong>Classification:</strong> {trustData.aiAnalysis.classification}</li>
                                              <li><strong>Analysis:</strong> {trustData.aiAnalysis.analysis}</li>
                                              {trustData.aiAnalysis.flags && trustData.aiAnalysis.flags.length > 0 && (
                                                <>
                                                  <li><strong>Flags:</strong></li>
                                                  <ul className="list-disc list-inside ml-4">
                                                    {trustData.aiAnalysis.flags.map((flag: string, idx: number) => (
                                                      <li key={idx}>{flag}</li>
                                                    ))}
                                                  </ul>
                                                </>
                                              )}
                                              {trustData.aiAnalysis.recommendations && trustData.aiAnalysis.recommendations.length > 0 && (
                                                <>
                                                  <li><strong>Recommendations:</strong></li>
                                                  <ul className="list-disc list-inside ml-4">
                                                    {trustData.aiAnalysis.recommendations.map((rec: string, idx: number) => (
                                                      <li key={idx}>{rec}</li>
                                                    ))}
                                                  </ul>
                                                </>
                                              )}
                                            </ul>
                                          </div>
                                          <div className="mt-4">
                                            <RippleButton
                                              onClick={() => downloadTrustScoreReport(workflow)}
                                              size="sm"
                                              className="flex items-center gap-2"
                                              disabled={downloadingTrustScoreReport === workflow.documentId}
                                            >
                                              {downloadingTrustScoreReport === workflow.documentId ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                              ) : (
                                                <Download className="h-4 w-4" />
                                              )}
                                              {downloadingTrustScoreReport === workflow.documentId ? "Generating..." : "Download Trust Score Report"}
                                            </RippleButton>
                                          </div>
                                        </>
                                      )
                                    })()}
                                  </div>
                                )}

                                {/* Human Review Status */}
                                {workflow.humanReviewData && (
                                  <div className="bg-gray-800/50 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      Human Review Status
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Status:</span>
                                        <span className="text-yellow-500">Under Review</span>
                                      </div>
                                      {workflow.humanReviewData.reviewerNotes && (
                                        <div className="text-gray-400 text-xs mt-2">
                                          {workflow.humanReviewData.reviewerNotes}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* NFT Minting Status */}
                                {workflow.nftMintingData && (
                                  <div className="bg-gray-800/50 rounded-lg p-4">
                                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4" />
                                      NFT Minting Status
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Status:</span>
                                        <span className="text-green-500">Completed</span>
                                      </div>
                                      {workflow.nftMintingData.tokenId && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Token ID:</span>
                                          <span className="text-white">{workflow.nftMintingData.tokenId}</span>
                                        </div>
                                      )}
                                      {workflow.nftMintingData.transactionHash && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Transaction:</span>
                                          <span className="text-white font-mono text-xs">{workflow.nftMintingData.transactionHash}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="relative bg-gray-800/80 p-6 rounded-full border border-gray-700">
                  <FileText className="h-16 w-16 text-blue-400" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                No Documents Yet
              </h2>
              <p className="text-gray-400 max-w-md mb-8">
                Upload your first document to begin the verification process. We support various document formats including PDF, DOCX, and more.
              </p>
              <RippleButton
                onClick={() => router.push('/workflow')}
                className="bg-gradient-to-r from-mintellect-primary to-mintellect-secondary hover:from-blue-500 hover:to-blue-400"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Your First Document
              </RippleButton>
            </div>
          </GlassCard>
        </motion.div>
        )}
      </main>

      {/* Resume Workflow Modal */}
      <AnimatePresence>
        {showResumeModal && selectedArchive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glassmorphic-card border border-gray-700 rounded-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold">Resume Workflow</h3>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-medium mb-2">{selectedArchive.documentName}</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    This will resume your workflow from where you left off. All your progress will be restored.
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      <strong>Status:</strong> {getStatusText(selectedArchive.status)}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Last Updated:</strong> {formattedDates[selectedArchive.documentId || ''] || ''}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <RippleButton variant="outline" onClick={() => setShowResumeModal(false)}>
                    Cancel
                  </RippleButton>
                  <RippleButton 
                    onClick={handleResumeFromArchive}
                    className="bg-gradient-to-r from-mintellect-primary to-mintellect-secondary hover:from-blue-500 hover:to-blue-400"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Resume Workflow
                  </RippleButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glassmorphic-card border border-gray-700 rounded-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold">Upload Document</h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 mb-6 text-center hover:border-mintellect-primary transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300 mb-2">Drag and drop your document here</p>
                  <p className="text-gray-500 text-sm">or</p>
                  <button className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                    Browse Files
                  </button>
                  <p className="text-gray-500 text-xs mt-4">Supported formats: PDF, DOCX, TXT, RTF (Max size: 20MB)</p>
                </div>
                <div className="flex justify-end gap-3">
                  <RippleButton variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                    Cancel
                  </RippleButton>
                  <RippleButton className="bg-gradient-to-r from-mintellect-primary to-mintellect-secondary hover:from-blue-500 hover:to-blue-400">
                    Upload Document
                  </RippleButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
