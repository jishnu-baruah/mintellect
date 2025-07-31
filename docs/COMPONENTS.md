# Mintellect - Components Documentation

## 🎯 Components Overview

This document provides comprehensive documentation for all components used in the Mintellect project, including UI components, custom components, layout components, and feature-specific components.

### 📁 Component Structure

```
components/
├── ui/                    # shadcn/ui components
├── animated-logo.tsx      # Animated logo component
├── breadcrumb.tsx         # Breadcrumb navigation
├── card-hover-effect-demo.tsx
├── dashboard-sidebar.tsx  # Dashboard sidebar
├── document-list.tsx      # Document listing
├── file-upload.tsx        # File upload component
├── flip-words-demo.tsx    # Text animation demo
├── hover-border-gradient-demo.tsx
├── human-review-interface.tsx
├── navbar.tsx             # Navigation bar
├── nft-minting.tsx        # NFT minting component
├── page-loader.tsx        # Loading component
├── paper-card.tsx         # Paper display card
├── paper-filters.tsx      # Paper filtering
├── paper-purchase.tsx     # Paper purchase flow
├── PaymentComponent.tsx   # Payment handling
├── plagiarism-reduction.tsx
├── plagiarism-report-viewer.tsx
├── PlagiarismPayment.tsx
├── PlagiarismWorkflow.tsx
├── profile-gate.tsx       # Profile completion gate
├── registration-modal.tsx # Registration modal
├── text-hover-effect-demo.tsx
├── theme-provider.tsx     # Theme management
├── trust-score-generator.tsx
├── wallet-connect-button.tsx
├── wallet-provider.tsx
├── wallet-test.tsx
├── wallet-troubleshooting.tsx
└── Web3Providers.tsx
```

---

## 🎨 UI Components (shadcn/ui)

### Core UI Components

#### Button Component
```typescript
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

**Usage:**
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">
  Click me
</Button>
```

#### Card Component
```typescript
// components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
```

**Usage:**
```tsx
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <p>Card footer</p>
  </CardFooter>
</Card>
```

#### Dialog Component
```typescript
// components/ui/dialog.tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close
```

**Usage:**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

### Specialized UI Components

#### Animated Background
```typescript
// components/ui/animated-background.tsx
export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
      <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
    </div>
  )
}
```

#### Glass Card
```typescript
// components/ui/glass-card.tsx
export const GlassCard = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

---

## 🧩 Custom Components

### Navigation Components

#### Navbar Component
```typescript
// components/navbar.tsx
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "./wallet-connect-button"
import { ThemeToggle } from "./theme-toggle"

export const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">Mintellect</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <WalletConnectButton />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
```

#### Dashboard Sidebar
```typescript
// components/dashboard-sidebar.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "Home",
  },
  {
    title: "Documents",
    href: "/documents",
    icon: "FileText",
  },
  {
    title: "Workflow",
    href: "/workflow",
    icon: "Workflow",
  },
  // ... more items
]

export const DashboardSidebar = () => {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-56 flex-col border-r bg-background">
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
```

### Form Components

#### File Upload Component
```typescript
// components/file-upload.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number
  multiple?: boolean
}

export const FileUpload = ({
  onFileSelect,
  acceptedTypes = [".pdf", ".doc", ".docx"],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) => {
      const isValidType = acceptedTypes.some((type) =>
        file.name.toLowerCase().endsWith(type)
      )
      const isValidSize = file.size <= maxSize
      return isValidType && isValidSize
    })

    setSelectedFiles(validFiles)
    validFiles.forEach((file) => onFileSelect(file))
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFileSelect(e.dataTransfer.files)
        }}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag and drop files here, or click to select
        </p>
        <Input
          type="file"
          className="mt-4"
          accept={acceptedTypes.join(",")}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Feature Components

#### Trust Score Generator
```typescript
// components/trust-score-generator.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "./file-upload"

export const TrustScoreGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [score, setScore] = useState<number | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsGenerating(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setScore(Math.floor(Math.random() * 100))
          return 100
        }
        return prev + 10
      })
    }, 500)

    // TODO: Implement actual trust score generation
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Generate Trust Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUpload onFileSelect={handleFileUpload} />
        
        {isGenerating && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Generating trust score...</p>
            <Progress value={progress} />
          </div>
        )}

        {score !== null && (
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{score}/100</p>
            <p className="text-sm text-muted-foreground">Trust Score</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

#### NFT Minting Component
```typescript
// components/nft-minting.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/hooks/useWallet"
import { mintNFT } from "@/lib/contracts"

export const NFTMinting = () => {
  const { address, isConnected } = useWallet()
  const [isMinting, setIsMinting] = useState(false)
  const [tokenId, setTokenId] = useState<string | null>(null)

  const handleMint = async () => {
    if (!isConnected) return

    setIsMinting(true)
    try {
      const id = await mintNFT(address!)
      setTokenId(id)
    } catch (error) {
      console.error("Minting failed:", error)
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Mint NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <p className="text-sm text-muted-foreground">
            Connect your wallet to mint an NFT
          </p>
        ) : (
          <>
            <Button
              onClick={handleMint}
              disabled={isMinting}
              className="w-full"
            >
              {isMinting ? "Minting..." : "Mint NFT"}
            </Button>

            {tokenId && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Token ID:</p>
                <p className="font-mono text-lg">{tokenId}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
```

#### Plagiarism Workflow Component
```typescript
// components/PlagiarismWorkflow.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "./file-upload"

interface PlagiarismResult {
  score: number
  matches: Array<{
    source: string
    similarity: number
    text: string
  }>
}

export const PlagiarismWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<PlagiarismResult | null>(null)

  const steps = [
    { id: 1, title: "Upload Document", description: "Upload your document for analysis" },
    { id: 2, title: "Processing", description: "Analyzing document for plagiarism" },
    { id: 3, title: "Results", description: "View plagiarism analysis results" },
  ]

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    setCurrentStep(2)

    // TODO: Implement actual plagiarism detection
    setTimeout(() => {
      setResult({
        score: 85,
        matches: [
          {
            source: "Sample Paper 1",
            similarity: 0.15,
            text: "This is a sample matched text...",
          },
        ],
      })
      setCurrentStep(3)
      setIsProcessing(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                currentStep >= step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/25"
              )}
            >
              {step.id}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-16",
                  currentStep > step.id ? "bg-primary" : "bg-muted-foreground/25"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{steps[0].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onFileSelect={handleFileUpload} />
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{steps[1].title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={isProcessing ? undefined} />
            <p className="text-sm text-muted-foreground">
              Analyzing your document for potential plagiarism...
            </p>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && result && (
        <Card>
          <CardHeader>
            <CardTitle>{steps[2].title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{result.score}%</p>
              <p className="text-sm text-muted-foreground">Originality Score</p>
            </div>

            {result.matches.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Similar Content Found:</h4>
                {result.matches.map((match, index) => (
                  <div key={index} className="p-3 border rounded">
                    <p className="text-sm font-medium">{match.source}</p>
                    <p className="text-sm text-muted-foreground">
                      Similarity: {Math.round(match.similarity * 100)}%
                    </p>
                    <p className="text-sm mt-1">{match.text}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

---

## 🔧 Layout Components

### Theme Provider
```typescript
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Wallet Provider
```typescript
// components/wallet-provider.tsx
"use client"

import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, http } from "wagmi"
import { educhain } from "@/lib/chains"

const { wallets } = getDefaultWallets({
  appName: "Mintellect",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
})

const config = createConfig({
  chains: [educhain],
  transports: {
    [educhain.id]: http(),
  },
})

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains} wallets={wallets}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

---

## 🎯 Component Best Practices

### 1. Component Structure
```typescript
// Good component structure
interface ComponentProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export const Component = ({
  title,
  description,
  children,
  className,
  ...props
}: ComponentProps) => {
  return (
    <div className={cn("base-styles", className)} {...props}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
      {children}
    </div>
  )
}
```

### 2. Error Boundaries
```typescript
// components/error-boundary.tsx
import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>
    }

    return this.props.children
  }
}
```

### 3. Loading States
```typescript
// components/loading-spinner.tsx
export const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted-foreground/25 border-t-primary",
          sizeClasses[size]
        )}
      />
    </div>
  )
}
```

### 4. Accessibility
```typescript
// components/accessible-button.tsx
import { forwardRef } from "react"
import { Button } from "@/components/ui/button"

interface AccessibleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  "aria-label"?: string
  "aria-describedby"?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="button"
        {...props}
      >
        {children}
      </Button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton"
```

---

## 📱 Responsive Design

### Mobile-First Approach
```typescript
// components/responsive-card.tsx
export const ResponsiveCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
      <Card className="p-4 sm:p-6 lg:p-8">
        {children}
      </Card>
    </div>
  )
}
```

### Breakpoint Utilities
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

---

## 🎨 Styling Guidelines

### 1. CSS Classes
- Use Tailwind CSS utility classes
- Follow the design system color palette
- Maintain consistent spacing and typography
- Use semantic class names

### 2. Dark Mode Support
```typescript
// Ensure all components support dark mode
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content
</div>
```

### 3. Animation Guidelines
```typescript
// Use consistent animation durations
const animationClasses = {
  fast: "duration-150",
  normal: "duration-300",
  slow: "duration-500",
}

// Use consistent easing functions
const easingClasses = {
  ease: "ease-in-out",
  bounce: "ease-out",
  linear: "linear",
}
```

---

## 🔍 Testing Components

### 1. Unit Testing
```typescript
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText("Click me"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 2. Integration Testing
```typescript
// __tests__/components/file-upload.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { FileUpload } from "@/components/file-upload"

describe("FileUpload", () => {
  it("handles file selection", async () => {
    const onFileSelect = jest.fn()
    render(<FileUpload onFileSelect={onFileSelect} />)
    
    const file = new File(["test content"], "test.pdf", { type: "application/pdf" })
    const input = screen.getByRole("button", { name: /upload/i })
    
    fireEvent.change(input, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(onFileSelect).toHaveBeenCalledWith(file)
    })
  })
})
```

---

*This components documentation provides comprehensive coverage of all components used in the Mintellect project. For specific implementation details, refer to the individual component files.* 