# Mintellect - Pages & Routes Documentation

## 🎯 Pages Overview

This document provides comprehensive documentation for all pages and routes in the Mintellect project, including their structure, functionality, and navigation flow.

### 📁 Page Structure

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── analytics/
│   ├── loading.tsx
│   └── page.tsx               # Analytics dashboard
├── api/                       # API routes
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   └── register/
│   │       └── route.ts
│   ├── trust-score/
│   │   └── generate/
│   └── workflow/
│       ├── archive/
│       │   └── route.ts
│       ├── archives/
│       │   └── route.ts
│       └── resume/
│           └── route.ts
├── certificates/
│   └── [id]/
│       └── page.tsx           # Certificate details
├── community/
│   ├── loading.tsx
│   ├── page.tsx               # Community hub
│   ├── papers/
│   │   └── [id]/
│   │       └── page.tsx       # Paper details
│   └── publish/
│       └── page.tsx           # Publish paper
├── connect-ocid/
│   └── page.tsx               # OCID connection
├── dashboard/
│   ├── layout.tsx             # Dashboard layout
│   ├── loading.tsx
│   └── page.tsx               # Main dashboard
├── documents/
│   ├── loading.tsx
│   └── page.tsx               # Document management
├── nft-gallery/
│   ├── loading.tsx
│   └── page.tsx               # NFT gallery
├── payment/
│   └── page.tsx               # Payment processing
├── results/
│   └── [id]/
│       └── page.tsx           # Analysis results
├── settings/
│   ├── billing/
│   │   └── page.tsx           # Billing settings
│   ├── notifications/
│   │   └── page.tsx           # Notification settings
│   ├── page.tsx               # Settings overview
│   ├── privacy/
│   │   └── page.tsx           # Privacy settings
│   ├── profile/
│   │   └── page.tsx           # Profile settings
│   └── security/
│       └── page.tsx           # Security settings
├── test-wallet/
│   └── page.tsx               # Wallet testing
├── trust-score/
│   ├── generate/
│   │   ├── loading.tsx
│   │   └── page.tsx           # Trust score generation
│   └── page.tsx               # Trust score overview
└── workflow/
    ├── loading.tsx
    └── page.tsx               # Workflow management
```

---

## 🏠 Core Pages

### Landing Page (`/`)
```typescript
// app/page.tsx
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Contact } from "@/components/contact"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <Contact />
    </main>
  )
}
```

**Features:**
- Hero section with call-to-action
- Feature showcase
- Pricing plans
- Contact form
- Responsive design

### Root Layout (`/layout.tsx`)
```typescript
// app/layout.tsx
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Mintellect - Academic Integrity Platform",
  description: "Verify academic documents and mint NFTs with blockchain technology",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 🎯 Dashboard Pages

### Main Dashboard (`/dashboard`)
```typescript
// app/dashboard/page.tsx
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentDocuments } from "@/components/recent-documents"
import { QuickActions } from "@/components/quick-actions"
import { ActivityFeed } from "@/components/activity-feed"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDocuments />
        <QuickActions />
      </div>
      
      <ActivityFeed />
    </div>
  )
}
```

**Features:**
- Overview statistics
- Recent document activity
- Quick action buttons
- Activity timeline
- Real-time updates

### Dashboard Layout (`/dashboard/layout.tsx`)
```typescript
// app/dashboard/layout.tsx
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProfileGate } from "@/components/profile-gate"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProfileGate>
      <div className="flex h-screen">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </ProfileGate>
  )
}
```

---

## 📄 Document Management

### Documents Page (`/documents`)
```typescript
// app/documents/page.tsx
import { DocumentList } from "@/components/document-list"
import { DocumentFilters } from "@/components/document-filters"
import { UploadButton } from "@/components/upload-button"

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>
        <UploadButton />
      </div>
      
      <DocumentFilters />
      <DocumentList />
    </div>
  )
}
```

**Features:**
- Document upload
- File management
- Search and filtering
- Bulk operations
- Document preview

### Document Results (`/results/[id]`)
```typescript
// app/results/[id]/page.tsx
import { DocumentViewer } from "@/components/document-viewer"
import { AnalysisResults } from "@/components/analysis-results"
import { ActionButtons } from "@/components/action-buttons"

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default function ResultsPage({ params }: ResultsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analysis Results</h1>
        <ActionButtons documentId={params.id} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentViewer documentId={params.id} />
        <AnalysisResults documentId={params.id} />
      </div>
    </div>
  )
}
```

---

## 🔐 Authentication Pages

### Login Page (`/login`)
```typescript
// app/login/page.tsx
import { LoginForm } from "@/components/login-form"
import { OAuthButtons } from "@/components/oauth-buttons"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your Mintellect account
          </p>
        </div>
        
        <LoginForm />
        <OAuthButtons />
      </div>
    </div>
  )
}
```

### Registration Modal
```typescript
// components/registration-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RegistrationForm } from "@/components/registration-form"

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        <RegistrationForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  )
}
```

---

## ⚙️ Settings Pages

### Settings Overview (`/settings`)
```typescript
// app/settings/page.tsx
import { SettingsNav } from "@/components/settings-nav"
import { SettingsContent } from "@/components/settings-content"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SettingsNav />
        <div className="md:col-span-3">
          <SettingsContent />
        </div>
      </div>
    </div>
  )
}
```

### Profile Settings (`/settings/profile`)
```typescript
// app/settings/profile/page.tsx
import { ProfileForm } from "@/components/profile-form"
import { AvatarUpload } from "@/components/avatar-upload"

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">
          Update your personal information and profile picture
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileForm />
        </div>
        <div>
          <AvatarUpload />
        </div>
      </div>
    </div>
  )
}
```

### Security Settings (`/settings/security`)
```typescript
// app/settings/security/page.tsx
import { PasswordChangeForm } from "@/components/password-change-form"
import { TwoFactorAuth } from "@/components/two-factor-auth"
import { SessionManagement } from "@/components/session-management"

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Security Settings</h2>
        <p className="text-muted-foreground">
          Manage your account security and privacy
        </p>
      </div>
      
      <div className="space-y-8">
        <PasswordChangeForm />
        <TwoFactorAuth />
        <SessionManagement />
      </div>
    </div>
  )
}
```

### Billing Settings (`/settings/billing`)
```typescript
// app/settings/billing/page.tsx
import { BillingOverview } from "@/components/billing-overview"
import { PaymentMethods } from "@/components/payment-methods"
import { BillingHistory } from "@/components/billing-history"

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>
      
      <div className="space-y-8">
        <BillingOverview />
        <PaymentMethods />
        <BillingHistory />
      </div>
    </div>
  )
}
```

---

## 🔄 Workflow Pages

### Workflow Management (`/workflow`)
```typescript
// app/workflow/page.tsx
import { WorkflowList } from "@/components/workflow-list"
import { WorkflowFilters } from "@/components/workflow-filters"
import { CreateWorkflowButton } from "@/components/create-workflow-button"

export default function WorkflowPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <CreateWorkflowButton />
      </div>
      
      <WorkflowFilters />
      <WorkflowList />
    </div>
  )
}
```

**Features:**
- Workflow creation
- Status tracking
- Progress monitoring
- Collaboration tools
- History and archives

---

## 🎓 Trust Score Pages

### Trust Score Generation (`/trust-score/generate`)
```typescript
// app/trust-score/generate/page.tsx
import { TrustScoreGenerator } from "@/components/trust-score-generator"
import { TrustScoreHistory } from "@/components/trust-score-history"

export default function TrustScoreGeneratePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Trust Score</h1>
        <p className="text-muted-foreground">
          Upload documents to generate trust scores and verify authenticity
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrustScoreGenerator />
        <TrustScoreHistory />
      </div>
    </div>
  )
}
```

### Trust Score Overview (`/trust-score`)
```typescript
// app/trust-score/page.tsx
import { TrustScoreStats } from "@/components/trust-score-stats"
import { TrustScoreChart } from "@/components/trust-score-chart"
import { RecentScores } from "@/components/recent-scores"

export default function TrustScorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trust Scores</h1>
        <p className="text-muted-foreground">
          View and manage your document trust scores
        </p>
      </div>
      
      <TrustScoreStats />
      <TrustScoreChart />
      <RecentScores />
    </div>
  )
}
```

---

## 🏛️ Community Pages

### Community Hub (`/community`)
```typescript
// app/community/page.tsx
import { CommunityStats } from "@/components/community-stats"
import { PaperList } from "@/components/paper-list"
import { CommunityFilters } from "@/components/community-filters"

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Explore and share academic papers with the community
        </p>
      </div>
      
      <CommunityStats />
      <CommunityFilters />
      <PaperList />
    </div>
  )
}
```

### Paper Details (`/community/papers/[id]`)
```typescript
// app/community/papers/[id]/page.tsx
import { PaperViewer } from "@/components/paper-viewer"
import { PaperMetadata } from "@/components/paper-metadata"
import { PaperActions } from "@/components/paper-actions"

interface PaperPageProps {
  params: {
    id: string
  }
}

export default function PaperPage({ params }: PaperPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Paper Details</h1>
        <PaperActions paperId={params.id} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaperViewer paperId={params.id} />
        </div>
        <div>
          <PaperMetadata paperId={params.id} />
        </div>
      </div>
    </div>
  )
}
```

### Publish Paper (`/community/publish`)
```typescript
// app/community/publish/page.tsx
import { PublishForm } from "@/components/publish-form"
import { PublishingGuidelines } from "@/components/publishing-guidelines"

export default function PublishPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Publish Paper</h1>
        <p className="text-muted-foreground">
          Share your research with the academic community
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PublishForm />
        </div>
        <div>
          <PublishingGuidelines />
        </div>
      </div>
    </div>
  )
}
```

---

## 🖼️ NFT Gallery

### NFT Gallery (`/nft-gallery`)
```typescript
// app/nft-gallery/page.tsx
import { NFTGrid } from "@/components/nft-grid"
import { NFTFilters } from "@/components/nft-filters"
import { NFTStats } from "@/components/nft-stats"

export default function NFTGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">NFT Gallery</h1>
        <p className="text-muted-foreground">
          View your minted academic NFTs and certificates
        </p>
      </div>
      
      <NFTStats />
      <NFTFilters />
      <NFTGrid />
    </div>
  )
}
```

---

## 📊 Analytics

### Analytics Dashboard (`/analytics`)
```typescript
// app/analytics/page.tsx
import { AnalyticsOverview } from "@/components/analytics-overview"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { AnalyticsFilters } from "@/components/analytics-filters"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your document verification and trust score metrics
        </p>
      </div>
      
      <AnalyticsFilters />
      <AnalyticsOverview />
      <AnalyticsCharts />
    </div>
  )
}
```

---

## 🔗 API Routes

### Authentication Routes

#### Login Route (`/api/auth/login`)
```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const user = await authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Set authentication cookies/tokens
    const response = NextResponse.json({ user })
    
    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
```

#### Register Route (`/api/auth/register`)
```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    const user = await createUser({ email, password, name })
    
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
```

### Workflow Routes

#### Archive Workflow (`/api/workflow/archive`)
```typescript
// app/api/workflow/archive/route.ts
import { NextRequest, NextResponse } from "next/server"
import { archiveWorkflow } from "@/lib/workflow"

export async function POST(request: NextRequest) {
  try {
    const { workflowId } = await request.json()
    
    await archiveWorkflow(workflowId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to archive workflow" },
      { status: 500 }
    )
  }
}
```

---

## 🧭 Navigation Structure

### Main Navigation
```typescript
// Navigation structure
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "Home",
  },
  {
    name: "Documents",
    href: "/documents",
    icon: "FileText",
  },
  {
    name: "Workflow",
    href: "/workflow",
    icon: "Workflow",
  },
  {
    name: "Trust Score",
    href: "/trust-score",
    icon: "Shield",
  },
  {
    name: "Community",
    href: "/community",
    icon: "Users",
  },
  {
    name: "NFT Gallery",
    href: "/nft-gallery",
    icon: "Image",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: "BarChart",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "Settings",
  },
]
```

### Breadcrumb Navigation
```typescript
// components/breadcrumb.tsx
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

export const Breadcrumb = () => {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <a href="/" className="flex items-center hover:text-foreground">
        <Home className="h-4 w-4" />
      </a>
      
      {segments.map((segment, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          <a
            href={`/${segments.slice(0, index + 1).join("/")}`}
            className="ml-1 hover:text-foreground capitalize"
          >
            {segment}
          </a>
        </div>
      ))}
    </nav>
  )
}
```

---

## 🔒 Route Protection

### Authentication Guards
```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                     request.nextUrl.pathname.startsWith("/register")
  
  if (!token && !isAuthPage && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
```

### Role-Based Access
```typescript
// components/role-guard.tsx
import { useAuth } from "@/hooks/use-auth"

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: string
  fallback?: React.ReactNode
}

export const RoleGuard = ({ children, requiredRole, fallback }: RoleGuardProps) => {
  const { user } = useAuth()
  
  if (!user || user.role !== requiredRole) {
    return fallback || <div>Access denied</div>
  }
  
  return <>{children}</>
}
```

---

## 📱 Responsive Design

### Mobile-First Approach
```typescript
// Responsive layout patterns
const responsiveClasses = {
  container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
  sidebar: "hidden md:block md:w-64 lg:w-80",
  content: "flex-1 min-w-0",
}
```

### Mobile Navigation
```typescript
// components/mobile-nav.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <DashboardSidebar />
      </SheetContent>
    </Sheet>
  )
}
```

---

## 🎨 Page Styling

### Consistent Layout Patterns
```typescript
// Common page layout
const PageLayout = ({ children, title, description }: PageLayoutProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
```

### Loading States
```typescript
// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}
```

### Error Boundaries
```typescript
// app/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

---

*This pages documentation provides comprehensive coverage of all pages and routes in the Mintellect project. For specific implementation details, refer to the individual page files.* 