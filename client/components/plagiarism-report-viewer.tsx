"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Download, Eye, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PlagiarismReportViewerProps {
  plagiarismResult: any
  documentName?: string
  className?: string
}

interface PlagiarismMatch {
  sentence?: string
  text?: string
  match?: string
  source?: string
  similarity?: number
  url?: string
}

export function PlagiarismReportViewer({ 
  plagiarismResult, 
  documentName = "Document",
  className = "" 
}: PlagiarismReportViewerProps) {
  const [showReport, setShowReport] = useState(false)
  const [sources, setSources] = useState<any[]>([])
  const [loadingSources, setLoadingSources] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const { toast } = useToast()

  if (!plagiarismResult) return null

  // Parse the actual PlagiarismSearch API response structure
  const parsePlagiarismData = () => {
    // Handle different response structures
    let data = plagiarismResult
    
    // If data is nested in a 'data' field (PlagiarismSearch API response)
    if (plagiarismResult.data && typeof plagiarismResult.data === 'object') {
      data = plagiarismResult.data
    }
    
    return {
      plagiarismScore: data.plagiarism || data.similarity || data.plagiat || 0,
      originalityScore: data.originality || (100 - (data.plagiarism || data.similarity || data.plagiat || 0)),
      aiProbability: data.ai_probability || data.ai_average_probability || null,
      status: data.status || 0,
      statusLabel: data.status_label || '',
      words: data.words || data.checked_words || 0,
      language: data.language || 'en',
      title: data.title || documentName,
      text: data.text || '',
      html: data.html || '',
      files: data.files || [],
      warnings: data.warnings || [],
      reportId: data.id || null,
      createdAt: data.created ? new Date(data.created * 1000) : new Date(),
      modifiedAt: data.modified ? new Date(data.modified * 1000) : new Date()
    }
  }

  const parsedData = parsePlagiarismData()
  const plagiarismScore = parsedData.plagiarismScore
  const originalityScore = parsedData.originalityScore
  const matches = plagiarismResult.matches || []
  const reportHtml = parsedData.html

  // Fetch sources from the API
  useEffect(() => {
    const fetchSources = async () => {
      if (!parsedData.reportId) return
      
      setLoadingSources(true)
      try {
        const response = await fetch(`http://localhost:8000/reports/sources/${parsedData.reportId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.data?.sources) {
            setSources(data.data.sources)
          }
        }
      } catch (error) {
        // Silently handle source fetching errors
      } finally {
        setLoadingSources(false)
      }
    }

    fetchSources()
  }, [parsedData.reportId])

  const getScoreColor = (score: number, isOriginality = false) => {
    if (isOriginality) {
      // Higher originality score is better
      if (score >= 80) return 'text-green-600' // Excellent - High originality
      if (score >= 60) return 'text-yellow-600' // Good - Moderate originality
      if (score >= 40) return 'text-orange-600' // Fair - Low originality
      if (score >= 20) return 'text-red-600' // Poor - Very low originality
      return 'text-red-700' // Very Poor - Critical originality
    } else {
      // Lower plagiarism score is better
      if (score <= 20) return 'text-green-600' // Excellent - Low plagiarism
      if (score <= 40) return 'text-yellow-600' // Good - Moderate plagiarism
      if (score <= 60) return 'text-orange-600' // Fair - High plagiarism
      if (score <= 80) return 'text-red-600' // Poor - Very high plagiarism
      return 'text-red-700' // Very Poor - Critical plagiarism
    }
  }

  const getScoreLevel = (score: number, isOriginality = false) => {
    if (isOriginality) {
      // Higher originality score is better
      if (score >= 80) return 'Excellent'
      if (score >= 60) return 'Good'
      if (score >= 40) return 'Fair'
      if (score >= 20) return 'Poor'
      return 'Very Poor'
    } else {
      // Lower plagiarism score is better
      if (score <= 20) return 'Excellent'
      if (score <= 40) return 'Good'
      if (score <= 60) return 'Fair'
      if (score <= 80) return 'Poor'
      return 'Very Poor'
    }
  }

  // Truncate percentage to 2 decimal points
  const formatPercentage = (value: number) => {
    return Number(value).toFixed(2)
  }

  // Parse HTML content to extract highlighted text
  const parseHighlightedContent = () => {
    if (!reportHtml) return null
    
    try {
      // Add styling to make highlights more visible
      const styledHtml = reportHtml
        .replace(/<span class="[^"]*">/g, '<span style="background-color: #fef2f2; color: #dc2626; padding: 1px 2px; border-radius: 2px; font-weight: bold;">')
        .replace(/<\/span>/g, '</span>')
        .replace(/<span style="[^"]*">/g, '<span style="background-color: #fef2f2; color: #dc2626; padding: 1px 2px; border-radius: 2px; font-weight: bold;">')
      
      return styledHtml
    } catch (error) {
      // Silently handle parsing errors
      return null
    }
  }

  const highlightedContent = parseHighlightedContent()
  
  // Also get the raw text content for fallback
  const rawTextContent = parsedData.text || ''
  
  // Get unique sources from the API response
  const getUniqueSources = () => {
    return sources.map((source: any) => ({
      name: source.title || source.url || 'Unknown Source',
      url: source.url || '',
      similarity: source.plagiarism || 0,
      count: source.count || 1,
      matches: source.matches || 0,
      matchedWords: source.matched_words || 0
    })).sort((a: any, b: any) => b.similarity - a.similarity)
  }

  const uniqueSources = getUniqueSources()

  // Get all matches for display
  const getAllMatches = () => {
    return sources.map((source: any) => ({
      source: source.title || source.url || 'Unknown Source',
      similarity: source.plagiarism || 0,
      url: source.url || '',
      text: `Plagiarism detected from ${source.title || source.url} (${source.plagiarism || 0}%)`,
      matches: source.matches || 0,
      matchedWords: source.matched_words || 0
    }))
  }

  const allMatches = getAllMatches()

  const downloadPDF = async () => {
    try {
      setDownloadingPDF(true)
      
      // Prepare data for server-side PDF generation
      const pdfData = {
        plagiarismData: {
          plagiarism: plagiarismScore,
          originality: originalityScore
        },
        documentName: documentName,
        sources: uniqueSources
      };

      // Call server-side PDF generation endpoint (S3 approach)
      const response = await fetch('http://localhost:5000/api/pdf/generate-plagiarism-report-s3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.downloadUrl) {
        throw new Error('Server did not return a valid download URL');
      }

      // Open the S3 download URL in a new tab
      window.open(result.downloadUrl, '_blank');

      toast({
        title: "PDF Ready for Download",
        description: "Your plagiarism report PDF has been generated and is ready for download.",
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "Download Failed",
        description: `Failed to generate PDF report: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setDownloadingPDF(false)
    }
  }

  return (
    <div className={className}>
      {/* Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Plagiarism Analysis Results
          </CardTitle>
          <CardDescription>
            Analysis completed for {documentName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Plagiarism Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(plagiarismScore)} mb-2`}>
                {formatPercentage(plagiarismScore)}%
              </div>
              <div className="text-sm text-gray-500 mb-2">Plagiarism Score</div>
              <Badge variant="outline" className={getScoreColor(plagiarismScore)}>
                {getScoreLevel(plagiarismScore)}
              </Badge>
            </div>

            {/* Originality Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(originalityScore, true)} mb-2`}>
                {formatPercentage(originalityScore)}%
              </div>
              <div className="text-sm text-gray-500 mb-2">Originality Score</div>
              <Badge variant="outline" className={getScoreColor(originalityScore, true)}>
                {getScoreLevel(originalityScore, true)}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Plagiarism</span>
              <span>Originality</span>
            </div>
            <Progress value={plagiarismScore} className="h-3" />
          </div>

          {/* Sources Summary */}
          {uniqueSources.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Sources ({uniqueSources.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueSources.slice(0, 5).map((source: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{source.name}</div>
                      {source.url && (
                        <div className="text-xs text-gray-500 truncate">{source.url}</div>
                      )}
                    </div>
                    <div className="text-red-600 font-bold text-sm ml-2">{formatPercentage(source.similarity)}%</div>
                  </div>
                ))}
                {uniqueSources.length > 5 && (
                  <div className="text-center text-sm text-gray-500">
                    +{uniqueSources.length - 5} more sources
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Detailed Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Detailed Plagiarism Report
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Score Summary */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(plagiarismScore)}`}>
                        {formatPercentage(plagiarismScore)}%
                      </div>
                      <div className="text-sm text-gray-500">Plagiarism</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(originalityScore, true)}`}>
                        {formatPercentage(originalityScore)}%
                      </div>
                      <div className="text-sm text-gray-500">Originality</div>
                    </div>
                  </div>

                                   {/* Sources List */}
                 {loadingSources ? (
                   <div className="text-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                     <p className="text-gray-500">Loading sources...</p>
                   </div>
                 ) : uniqueSources.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Plagiarism Sources ({uniqueSources.length})
                      </h3>
                      <div className="space-y-2">
                        {uniqueSources.map((source: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{index + 1}. {source.name}</div>
                              {source.url && (
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 break-all"
                                >
                                  {source.url}
                                </a>
                              )}
                            </div>
                            <div className="text-red-600 font-bold ml-4">{formatPercentage(source.similarity)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Sources Found</h3>
                      <p className="text-gray-500">No plagiarism sources were detected in this document.</p>
                    </div>
                  )}

                  {/* Raw HTML Report if available */}
                  {reportHtml && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
                      <div className="space-y-6">
                        {/* Summary Section */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                          <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Analysis Summary
                          </h4>
                          <div className="text-sm text-red-700 dark:text-red-300">
                            <div className="mb-2">
                              <strong>Plagiarism Score:</strong> {formatPercentage(plagiarismScore)}% ({getScoreLevel(plagiarismScore)})
                            </div>
                            <div className="mb-2">
                              <strong>Originality Score:</strong> {formatPercentage(originalityScore)}% ({getScoreLevel(originalityScore)})
                            </div>
                            <div>
                              <strong>Sources Found:</strong> {uniqueSources.length} unique sources
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={downloadPDF} className="flex items-center gap-2" disabled={downloadingPDF}>
              {downloadingPDF ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloadingPDF ? "Downloading..." : "Download PDF Report"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}