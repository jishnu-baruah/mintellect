# Mintellect - Hooks & Utilities Documentation

## 🎯 Hooks Overview

This document provides comprehensive documentation for all custom hooks and utility functions used in the Mintellect project, including their implementation, usage patterns, and examples.

### 📁 Hooks Structure

```
hooks/
├── use-mobile.tsx           # Mobile detection hook
├── use-toast.ts             # Toast notification hook
├── useProfileChecklist.ts   # Profile completion hook
└── useWallet.ts             # Wallet connection hook
```

---

## 🔧 Custom Hooks

### useWallet Hook
```typescript
// hooks/useWallet.ts
import { useState, useEffect } from "react"
import { useAccount, useDisconnect, useConnect } from "wagmi"
import { useWalletConnect } from "@rainbow-me/rainbowkit"

export const useWallet = () => {
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()
  const { open } = useWalletConnect()

  const [isConnectingWallet, setIsConnectingWallet] = useState(false)

  const connectWallet = async () => {
    setIsConnectingWallet(true)
    try {
      open()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnectingWallet(false)
    }
  }

  const disconnectWallet = () => {
    disconnect()
  }

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isConnectingWallet,
    connectWallet,
    disconnectWallet,
    connectors,
  }
}
```

**Usage:**
```tsx
import { useWallet } from "@/hooks/useWallet"

const MyComponent = () => {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet()

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  )
}
```

### useProfileChecklist Hook
```typescript
// hooks/useProfileChecklist.ts
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"

interface ProfileRequirement {
  id: string
  label: string
  completed: boolean
  required: boolean
}

export const useProfileChecklist = () => {
  const { user } = useAuth()
  const [requirements, setRequirements] = useState<ProfileRequirement[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!user) return

    const profileRequirements: ProfileRequirement[] = [
      {
        id: "email",
        label: "Email verified",
        completed: !!user.emailVerified,
        required: true,
      },
      {
        id: "name",
        label: "Full name provided",
        completed: !!user.name,
        required: true,
      },
      {
        id: "avatar",
        label: "Profile picture uploaded",
        completed: !!user.avatar,
        required: false,
      },
      {
        id: "bio",
        label: "Bio completed",
        completed: !!user.bio,
        required: false,
      },
      {
        id: "institution",
        label: "Institution added",
        completed: !!user.institution,
        required: false,
      },
    ]

    setRequirements(profileRequirements)
    setIsComplete(profileRequirements.every(req => req.completed || !req.required))
  }, [user])

  const getCompletionPercentage = () => {
    if (requirements.length === 0) return 0
    const completed = requirements.filter(req => req.completed).length
    return Math.round((completed / requirements.length) * 100)
  }

  return {
    requirements,
    isComplete,
    completionPercentage: getCompletionPercentage(),
  }
}
```

**Usage:**
```tsx
import { useProfileChecklist } from "@/hooks/useProfileChecklist"

const ProfileChecklist = () => {
  const { requirements, isComplete, completionPercentage } = useProfileChecklist()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Profile Completion</h3>
        <span className="text-sm text-muted-foreground">
          {completionPercentage}% Complete
        </span>
      </div>
      
      <div className="space-y-2">
        {requirements.map((requirement) => (
          <div key={requirement.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={requirement.completed}
              disabled
              className="rounded"
            />
            <span className={requirement.completed ? "line-through" : ""}>
              {requirement.label}
            </span>
            {requirement.required && (
              <span className="text-red-500 text-xs">*</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### useMobile Hook
```typescript
// hooks/use-mobile.tsx
import { useEffect, useState } from "react"

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
```

**Usage:**
```tsx
import { useMobile } from "@/hooks/use-mobile"

const ResponsiveComponent = () => {
  const isMobile = useMobile()

  return (
    <div className={isMobile ? "p-4" : "p-8"}>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  )
}
```

### useToast Hook
```typescript
// hooks/use-toast.ts
import { useToast as useToastOriginal } from "@/components/ui/use-toast"

export const useToast = () => {
  const { toast } = useToastOriginal()

  const showSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    })
  }

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    })
  }

  const showWarning = (message: string) => {
    toast({
      title: "Warning",
      description: message,
      variant: "default",
    })
  }

  const showInfo = (message: string) => {
    toast({
      title: "Info",
      description: message,
      variant: "default",
    })
  }

  return {
    toast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
```

**Usage:**
```tsx
import { useToast } from "@/hooks/use-toast"

const MyComponent = () => {
  const { showSuccess, showError } = useToast()

  const handleSubmit = async () => {
    try {
      await submitForm()
      showSuccess("Form submitted successfully!")
    } catch (error) {
      showError("Failed to submit form")
    }
  }

  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  )
}
```

---

## 🛠️ Utility Functions

### Contract Utilities
```typescript
// lib/contracts.ts
import { ethers } from "ethers"
import MintellectNFT_ABI from "./MintellectNFT_ABI.json"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!

export const getContract = (signer?: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, MintellectNFT_ABI, signer)
}

export const mintNFT = async (address: string, tokenURI: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = getContract(signer)
    
    const tx = await contract.mint(address, tokenURI)
    const receipt = await tx.wait()
    
    // Get the token ID from the event
    const event = receipt.logs.find((log: any) => 
      log.fragment?.name === "Transfer"
    )
    
    return event?.args?.[2]?.toString()
  } catch (error) {
    console.error("Minting failed:", error)
    throw error
  }
}

export const getTokenURI = async (tokenId: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = getContract(provider)
    
    return await contract.tokenURI(tokenId)
  } catch (error) {
    console.error("Failed to get token URI:", error)
    throw error
  }
}

export const getBalance = async (address: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = getContract(provider)
    
    return await contract.balanceOf(address)
  } catch (error) {
    console.error("Failed to get balance:", error)
    throw error
  }
}
```

### API Utilities
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Request failed",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: "Network error",
    }
  }
}

export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData()
  formData.append("file", file)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100
        onProgress(progress)
      }
    })

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error("Upload failed"))
      }
    })

    xhr.addEventListener("error", () => {
      reject(new Error("Network error"))
    })

    xhr.open("POST", `${API_BASE_URL}/upload`)
    xhr.send(formData)
  })
}
```

### Validation Utilities
```typescript
// lib/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateFile = (file: File, options: {
  maxSize?: number
  allowedTypes?: string[]
} = {}): {
  isValid: boolean
  errors: string[]
} => {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [".pdf", ".doc", ".docx"] } = options
  const errors: string[] = []

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`)
  }

  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))
  if (!allowedTypes.includes(fileExtension)) {
    errors.push(`File type must be one of: ${allowedTypes.join(", ")}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
```

### Date and Time Utilities
```typescript
// lib/date-utils.ts
export const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = {}) => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj)
}

export const formatRelativeTime = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  return formatDate(dateObj)
}

export const isToday = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const today = new Date()
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

export const isYesterday = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  )
}
```

### Storage Utilities
```typescript
// lib/storage.ts
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return defaultValue || null
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  },
}

export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error("Error reading from sessionStorage:", error)
      return defaultValue || null
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error writing to sessionStorage:", error)
    }
  },

  remove: (key: string): void => {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from sessionStorage:", error)
    }
  },

  clear: (): void => {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error("Error clearing sessionStorage:", error)
    }
  },
}
```

### String Utilities
```typescript
// lib/string-utils.ts
export const truncateText = (text: string, maxLength: number, suffix = "..."): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}
```

---

## 🔄 State Management Utilities

### Workflow Persistence
```typescript
// lib/workflow-persistence.ts
import { storage } from "./storage"

interface WorkflowState {
  id: string
  status: "draft" | "in-progress" | "completed" | "failed"
  data: any
  createdAt: Date
  updatedAt: Date
}

export const workflowPersistence = {
  save: (workflow: WorkflowState): void => {
    const workflows = storage.get<WorkflowState[]>("workflows", [])
    const existingIndex = workflows.findIndex(w => w.id === workflow.id)
    
    if (existingIndex >= 0) {
      workflows[existingIndex] = workflow
    } else {
      workflows.push(workflow)
    }
    
    storage.set("workflows", workflows)
  },

  get: (id: string): WorkflowState | null => {
    const workflows = storage.get<WorkflowState[]>("workflows", [])
    return workflows.find(w => w.id === id) || null
  },

  getAll: (): WorkflowState[] => {
    return storage.get<WorkflowState[]>("workflows", [])
  },

  delete: (id: string): void => {
    const workflows = storage.get<WorkflowState[]>("workflows", [])
    const filtered = workflows.filter(w => w.id !== id)
    storage.set("workflows", filtered)
  },

  clear: (): void => {
    storage.remove("workflows")
  },
}
```

### Form State Management
```typescript
// lib/form-utils.ts
import { useState, useCallback } from "react"

interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Partial<Record<keyof T, string>>
) => {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  })

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      touched: { ...prev.touched, [field]: true },
    }))
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }))
  }, [])

  const validate = useCallback(() => {
    if (!validationSchema) return true

    const errors = validationSchema(state.values)
    setState(prev => ({ ...prev, errors }))
    
    return Object.keys(errors).length === 0
  }, [state.values, validationSchema])

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setState(prev => ({ ...prev, isSubmitting: true }))

    try {
      if (validate()) {
        await onSubmit(state.values)
      }
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }))
    }
  }, [state.values, validate])

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    })
  }, [initialValues])

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    setFieldValue,
    setFieldError,
    validate,
    handleSubmit,
    reset,
  }
}
```

---

## 🎨 UI Utilities

### Class Name Utilities
```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}
```

### Animation Utilities
```typescript
// lib/animation-utils.ts
export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const slideInVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1 },
}

export const scaleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}
```

---

## 🔍 Debug Utilities

### Logger Utility
```typescript
// lib/logger.ts
type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: Date
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
    }

    this.logs.push(entry)

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output in development
    if (process.env.NODE_ENV === "development") {
      const prefix = `[${entry.timestamp.toISOString()}] [${level.toUpperCase()}]`
      console[level](prefix, message, data || "")
    }
  }

  debug(message: string, data?: any) {
    this.log("debug", message, data)
  }

  info(message: string, data?: any) {
    this.log("info", message, data)
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data)
  }

  error(message: string, data?: any) {
    this.log("error", message, data)
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return [...this.logs]
  }

  clear() {
    this.logs = []
  }
}

export const logger = new Logger()
```

### Performance Utilities
```typescript
// lib/performance.ts
export const measurePerformance = <T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()
    
    console.log(`${name} took ${end - start}ms`)
    return result
  }) as T
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}
```

---

## 🧪 Testing Utilities

### Test Helpers
```typescript
// lib/test-utils.ts
import { render, RenderOptions } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </ThemeProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }
```

### Mock Data Generators
```typescript
// lib/mock-data.ts
export const generateMockUser = (overrides = {}) => ({
  id: "user_123",
  email: "test@example.com",
  name: "Test User",
  avatar: "https://example.com/avatar.jpg",
  institution: "Test University",
  bio: "Test bio",
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const generateMockDocument = (overrides = {}) => ({
  id: "doc_123",
  title: "Test Document",
  filename: "test-document.pdf",
  size: 1024 * 1024, // 1MB
  type: "application/pdf",
  uploadedAt: new Date().toISOString(),
  status: "processed",
  trustScore: 85,
  ...overrides,
})

export const generateMockWorkflow = (overrides = {}) => ({
  id: "workflow_123",
  name: "Test Workflow",
  status: "in-progress",
  steps: [
    { id: "step_1", name: "Upload", completed: true },
    { id: "step_2", name: "Process", completed: false },
    { id: "step_3", name: "Review", completed: false },
  ],
  createdAt: new Date().toISOString(),
  ...overrides,
})
```

---

*This hooks and utilities documentation provides comprehensive coverage of all custom hooks and utility functions used in the Mintellect project. For specific implementation details, refer to the individual hook and utility files.* 