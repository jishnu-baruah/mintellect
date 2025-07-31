# Mintellect - Frontend Documentation

## 🎯 Frontend Overview

The Mintellect frontend is built with **Next.js 15.4.5** using the App Router architecture, providing a modern, responsive, and performant user interface for the AI-powered academic integrity platform.

### 🏗️ Technology Stack

#### Core Framework
- **Next.js 15.4.5** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **TailwindCSS 3.4.17** - Utility-first CSS framework

#### UI & Components
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

#### State Management & Data Fetching
- **SWR 2.3.4** - Data fetching and caching
- **React Hook Form 7.54.1** - Form state management
- **Zod 3.24.1** - Schema validation

#### Web3 Integration
- **RainbowKit 2.2.8** - Wallet connection UI
- **Wagmi 2.16.0** - React hooks for Ethereum
- **Viem 2.33.2** - TypeScript interface for Ethereum
- **Ethers.js 6.7.1** - Ethereum library

#### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 Project Structure

### App Router Structure (Next.js 13+)
```
client/app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Home page
├── globals.css               # Global styles
├── dashboard/                # Main dashboard
│   ├── layout.tsx            # Dashboard layout
│   ├── page.tsx              # Dashboard home
│   └── loading.tsx           # Loading state
├── workflow/                 # Document verification workflow
│   ├── page.tsx              # Workflow interface
│   └── loading.tsx           # Loading state
├── documents/                # Document management
│   ├── page.tsx              # Document list
│   └── loading.tsx           # Loading state
├── analytics/                # Analytics dashboard
│   ├── page.tsx              # Analytics interface
│   └── loading.tsx           # Loading state
├── nft-gallery/              # NFT certificate gallery
│   ├── page.tsx              # Gallery interface
│   └── loading.tsx           # Loading state
├── community/                # Community features
│   ├── page.tsx              # Community interface
│   ├── papers/               # Research papers
│   │   └── [id]/             # Individual paper
│   │       └── page.tsx      # Paper details
│   └── publish/              # Paper publishing
│       └── page.tsx          # Publish interface
├── settings/                 # User settings
│   ├── profile/              # Profile settings
│   ├── security/             # Security settings
│   ├── notifications/        # Notification settings
│   ├── privacy/              # Privacy settings
│   └── billing/              # Billing settings
├── trust-score/              # Trust score generation
│   ├── page.tsx              # Trust score interface
│   └── generate/             # Score generation
│       ├── page.tsx          # Generation interface
│       └── loading.tsx       # Loading state
├── certificates/             # Certificate management
│   └── [id]/                 # Individual certificate
│       └── page.tsx          # Certificate details
├── results/                  # Analysis results
│   └── [id]/                 # Individual result
│       └── page.tsx          # Result details
├── payment/                  # Payment processing
│   └── page.tsx              # Payment interface
├── connect-ocid/             # OCID connection
│   └── page.tsx              # Connection interface
├── test-wallet/              # Wallet testing
│   └── page.tsx              # Test interface
└── api/                      # API routes (Next.js)
    ├── auth/                 # Authentication endpoints
    │   ├── login/            # Login endpoint
    │   └── register/         # Registration endpoint
    ├── trust-score/          # Trust score endpoints
    │   └── generate/         # Generation endpoint
    └── workflow/             # Workflow endpoints
        ├── archive/          # Archive endpoint
        ├── archives/         # Archives endpoint
        └── resume/           # Resume endpoint
```

### Component Structure
```
client/components/
├── ui/                       # shadcn/ui components
│   ├── button.tsx            # Button component
│   ├── input.tsx             # Input component
│   ├── card.tsx              # Card component
│   ├── dialog.tsx            # Dialog component
│   ├── form.tsx              # Form component
│   ├── toast.tsx             # Toast notifications
│   ├── animated-logo.tsx     # Animated logo
│   └── [other-ui-components] # Additional UI components
├── dashboard-sidebar.tsx     # Main navigation sidebar
├── navbar.tsx                # Top navigation bar
├── profile-gate.tsx          # Authentication gate
├── Web3Providers.tsx         # Web3 context providers
├── wallet-provider.tsx       # Wallet state management
├── wallet-connect-button.tsx # Wallet connection button
├── file-upload.tsx           # File upload component
├── document-list.tsx         # Document listing
├── trust-score-generator.tsx # Trust score generation
├── PlagiarismWorkflow.tsx    # Plagiarism detection workflow
├── human-review-interface.tsx # Human review interface
├── nft-minting.tsx           # NFT minting component
├── plagiarism-report-viewer.tsx # Plagiarism report display
├── plagiarism-reduction.tsx  # Plagiarism reduction tools
├── PaymentComponent.tsx      # Payment processing
├── PlagiarismPayment.tsx     # Plagiarism payment
├── paper-card.tsx            # Research paper card
├── paper-filters.tsx         # Paper filtering
├── paper-purchase.tsx        # Paper purchase interface
├── registration-modal.tsx    # User registration modal
├── page-loader.tsx           # Page loading component
├── breadcrumb.tsx            # Navigation breadcrumbs
├── ai-capabilities.tsx       # AI features showcase
├── ai-eligibility-checker.tsx # AI eligibility checker
├── wallet-test.tsx           # Wallet testing interface
├── wallet-troubleshooting.tsx # Wallet troubleshooting
└── theme-provider.tsx        # Theme management
```

### Hooks & Utilities
```
client/hooks/
├── useWallet.ts              # Wallet connection hook
├── useProfileChecklist.ts    # Profile completion hook
└── use-mobile.tsx            # Mobile detection hook

client/lib/
├── utils.ts                  # Utility functions
├── MintellectNFT_ABI.json    # Smart contract ABI
└── workflow-persistence.ts   # Workflow state persistence

client/types/
└── user.ts                   # User type definitions
```

---

## 🎨 Component Architecture

### Layout Components

#### RootLayout (`app/layout.tsx`)
The root layout provides the foundation for the entire application:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Web3Providers>
            <div className="fixed inset-0 z-0 scale-[0.8] origin-top-left">
              <div className="flex h-[125vh] bg-black overflow-hidden">
                <DashboardSidebar />
                <div className="flex-1 flex flex-col overflow-hidden ml-16 md:ml-0">
                  <main className="flex-1 overflow-y-auto hide-scrollbar">
                    <ProfileGate>{children}</ProfileGate>
                  </main>
                </div>
              </div>
            </div>
          </Web3Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Features:**
- **Theme Provider**: Dark/light mode support
- **Web3 Providers**: Blockchain integration
- **Dashboard Sidebar**: Navigation
- **Profile Gate**: Authentication protection
- **Responsive Design**: Mobile-first approach

#### DashboardSidebar (`components/dashboard-sidebar.tsx`)
The main navigation sidebar with collapsible design:

```typescript
export function DashboardSidebar({ className }: { className?: string }) {
  const [collapsed, setCollapsed] = useState(() => true);
  const { walletConnected, connectWallet, disconnectWallet } = useWallet();
  
  // Navigation items
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
    { href: "/workflow", label: "Verification", icon: FileText },
    { href: "/documents", label: "Documents", icon: Shield },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/nft-gallery", label: "Certificates", icon: Award },
    { href: "/community", label: "Community", icon: Users },
  ];

  return (
    <aside className={cn("relative flex flex-col h-screen bg-black", className)}>
      {/* Logo and Title */}
      {/* Navigation Items */}
      {/* Settings Submenu */}
      {/* Wallet Connection */}
      {/* Social Links */}
    </aside>
  );
}
```

**Features:**
- **Collapsible Design**: Expandable/collapsible sidebar
- **Mobile Responsive**: Different behavior on mobile
- **Tooltip Support**: Hover tooltips for collapsed state
- **Settings Submenu**: Expandable settings menu
- **Wallet Integration**: Built-in wallet connection
- **Social Links**: Telegram and Twitter integration

### Authentication Components

#### ProfileGate (`components/profile-gate.tsx`)
Authentication gate that protects routes:

```typescript
export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { profileComplete, checking, walletConnected } = useProfileGate();
  const pathname = usePathname();
  
  if (checking) {
    return <LoadingScreen />;
  }
  
  if (!walletConnected) {
    return <WalletConnectionScreen />;
  }
  
  if (!profileComplete) {
    return <ProfileCompletionScreen />;
  }
  
  return <>{children}</>;
}
```

**Features:**
- **Wallet Authentication**: Checks wallet connection
- **Profile Completion**: Ensures profile is complete
- **Loading States**: Proper loading indicators
- **Route Protection**: Guards all protected routes

#### WalletConnectButton (`components/wallet-connect-button.tsx`)
Custom wallet connection button:

```typescript
export function WalletConnectButton() {
  const { walletConnected, connectWallet, disconnectWallet, error } = useWallet();
  
  return (
    <button
      onClick={walletConnected ? disconnectWallet : connectWallet}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg",
        walletConnected 
          ? "bg-green-500/10 text-green-400 border-green-500/30"
          : "bg-blue-600/10 text-blue-400 border-blue-500/30"
      )}
    >
      <Wallet className="w-5 h-5" />
      {walletConnected ? "Connected" : "Connect Wallet"}
    </button>
  );
}
```

### Feature Components

#### FileUpload (`components/file-upload.tsx`)
Advanced file upload component:

```typescript
export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8">
      {/* Drag & Drop Interface */}
      {/* File Selection */}
      {/* Upload Progress */}
      {/* Error Handling */}
    </div>
  );
}
```

**Features:**
- **Drag & Drop**: Modern file upload interface
- **Progress Tracking**: Real-time upload progress
- **File Validation**: Type and size validation
- **Error Handling**: Comprehensive error states
- **Multiple Formats**: PDF, DOCX, TXT, ZIP support

#### TrustScoreGenerator (`components/trust-score-generator.tsx`)
Trust score calculation interface:

```typescript
export function TrustScoreGenerator() {
  const [textContent, setTextContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState(null);
  
  const generateTrustScore = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/trust-score/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textContent }),
      });
      
      const result = await response.json();
      setResults(result.data);
    } catch (error) {
      // Handle error
    } finally {
      setGenerating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Text Input */}
      {/* Generate Button */}
      {/* Results Display */}
      {/* Recommendations */}
    </div>
  );
}
```

**Features:**
- **Text Analysis**: Real-time text processing
- **Score Calculation**: Multi-factor trust scoring
- **Recommendations**: AI-powered suggestions
- **Visual Results**: Charts and metrics display
- **Export Options**: PDF report generation

#### PlagiarismWorkflow (`components/PlagiarismWorkflow.tsx`)
Complete plagiarism detection workflow:

```typescript
export function PlagiarismWorkflow() {
  const [step, setStep] = useState(1);
  const [document, setDocument] = useState(null);
  const [results, setResults] = useState(null);
  
  const workflowSteps = [
    { id: 1, name: 'Upload Document', status: 'completed' },
    { id: 2, name: 'Text Extraction', status: 'processing' },
    { id: 3, name: 'Plagiarism Check', status: 'pending' },
    { id: 4, name: 'Human Review', status: 'pending' },
    { id: 5, name: 'Generate Report', status: 'pending' },
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      {/* Step Content */}
      {/* Navigation */}
    </div>
  );
}
```

**Features:**
- **Multi-Step Workflow**: Guided process flow
- **Progress Tracking**: Visual progress indicators
- **Real-time Updates**: Live status updates
- **Human Review**: Manual review integration
- **Report Generation**: Comprehensive reports

### UI Components (shadcn/ui)

#### Button Component
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

#### Form Components
```typescript
const Form = FormProvider;

const FormField = ({ name, ...props }: FormFieldProps) => {
  const form = useFormContext();
  return <FormFieldContext.Provider value={{ name }} {...props} />;
};

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
  }
);
```

---

## 🔄 State Management

### React Hooks Pattern
The application uses React hooks for state management:

#### useWallet Hook
```typescript
export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const connectWallet = async () => {
    setError(null);
    setConnectionAttempts(prev => prev + 1);
    
    try {
      if (openConnectModal) {
        openConnectModal();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet');
    }
  };
  
  const disconnectWallet = () => {
    try {
      disconnect();
      setError(null);
      setConnectionAttempts(0);
    } catch (err: any) {
      console.error('Wallet disconnect error:', err);
    }
  };
  
  return {
    walletConnected: !!isConnected,
    walletAddress: address || '',
    connectWallet,
    disconnectWallet,
    error,
    isLoading: isConnecting || isReconnecting,
    connectionAttempts,
  };
}
```

#### useProfileChecklist Hook
```typescript
export function useProfileChecklist() {
  const { walletAddress, walletConnected } = useWallet();
  const shouldFetch = walletConnected && walletAddress;
  
  const { data, error, isLoading } = useSWR(
    shouldFetch ? [`${API_URL}/settings/profile/requirements`, walletAddress] : null,
    ([url, wallet]) => fetcher(url, wallet),
    { revalidateOnFocus: false }
  );
  
  return {
    checklist: data?.checklist || [],
    allComplete: data?.allComplete || false,
    loading: isLoading,
    error,
    isNewUser: data === null,
    walletConnected,
    walletAddress
  };
}
```

### SWR for Data Fetching
```typescript
// Example: Fetching user documents
const { data: documents, error, isLoading } = useSWR(
  walletConnected ? `/api/files?wallet=${walletAddress}` : null,
  fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 30 seconds
  }
);

// Example: Mutating data
const { mutate } = useSWRConfig();

const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/files/upload', {
    method: 'POST',
    body: formData,
  });
  
  const result = await response.json();
  
  // Update the documents list
  mutate(`/api/files?wallet=${walletAddress}`);
  
  return result;
};
```

---

## 🎨 Styling & Theming

### TailwindCSS Configuration
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mintellect: {
          primary: "#00D4FF",
          secondary: "#FF6B6B",
          accent: "#4ECDC4",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: "hsl(var(--chart-1))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### CSS Variables for Theming
```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
```

### Custom Animations
```css
/* Custom animations for enhanced UX */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-gradient-shift {
  background: linear-gradient(-45deg, #00D4FF, #FF6B6B, #4ECDC4, #00D4FF);
  background-size: 400% 400%;
  animation: gradient-shift 4s ease infinite;
}
```

---

## 🔗 API Integration

### API Client Pattern
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  // Profile endpoints
  async getProfile(wallet: string) {
    return this.request(`/settings/profile/profile?wallet=${wallet}`);
  }
  
  async updateProfile(data: FormData) {
    return this.request('/settings/profile/profile', {
      method: 'POST',
      body: data,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
  
  // File endpoints
  async uploadFile(file: File, fileType?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (fileType) formData.append('fileType', fileType);
    
    return this.request('/api/files/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
  
  async getFiles(wallet: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams({ wallet, ...params });
    return this.request(`/api/files?${searchParams}`);
  }
  
  // Trust score endpoints
  async generateTrustScore(data: {
    textContent: string;
    plagiarismResults?: any;
    fileId: string;
  }) {
    return this.request('/api/trust-score/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  // Workflow endpoints
  async getWorkflows(wallet: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams({ wallet, ...params });
    return this.request(`/api/workflow?${searchParams}`);
  }
  
  async archiveWorkflow(workflowId: string, reason: string) {
    return this.request('/api/workflow/archive', {
      method: 'POST',
      body: JSON.stringify({ workflowId, reason }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### SWR Integration
```typescript
// hooks/useApi.ts
import useSWR from 'swr';
import { apiClient } from '@/lib/api';

export function useProfile(wallet: string) {
  return useSWR(
    wallet ? ['profile', wallet] : null,
    () => apiClient.getProfile(wallet)
  );
}

export function useFiles(wallet: string, params?: { page?: number; limit?: number }) {
  return useSWR(
    wallet ? ['files', wallet, params] : null,
    () => apiClient.getFiles(wallet, params)
  );
}

export function useWorkflows(wallet: string, params?: { page?: number; limit?: number }) {
  return useSWR(
    wallet ? ['workflows', wallet, params] : null,
    () => apiClient.getWorkflows(wallet, params)
  );
}
```

---

## 🚀 Performance Optimizations

### Next.js Optimizations
```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    domains: ['cloudinary.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
```

### Code Splitting
```typescript
// Dynamic imports for better performance
const PlagiarismWorkflow = dynamic(() => import('@/components/PlagiarismWorkflow'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const NFTMinting = dynamic(() => import('@/components/nft-minting'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const TrustScoreGenerator = dynamic(() => import('@/components/trust-score-generator'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

### Image Optimization
```typescript
import Image from 'next/image';

// Optimized image component
<Image
  src="/images/Mintellect_logo.png"
  alt="Mintellect Logo"
  width={200}
  height={200}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

---

## 🔧 Development Tools

### ESLint Configuration
```javascript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## 📱 Responsive Design

### Mobile-First Approach
```typescript
// Responsive breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Mobile detection hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return isMobile;
}
```

### Responsive Components
```typescript
// Example: Responsive sidebar
export function DashboardSidebar() {
  const isMobile = useIsMobile();
  
  return (
    <aside className={cn(
      "fixed top-0 left-0 z-40 h-screen bg-black",
      isMobile ? "w-16" : "w-64",
      "transition-all duration-300"
    )}>
      {/* Mobile: Icon-only navigation */}
      {/* Desktop: Full navigation with labels */}
    </aside>
  );
}
```

---

## 🧪 Testing Strategy

### Component Testing
```typescript
// __tests__/components/FileUpload.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '@/components/file-upload';

describe('FileUpload', () => {
  it('renders upload interface', () => {
    render(<FileUpload />);
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });
  
  it('handles file selection', () => {
    render(<FileUpload />);
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/file input/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });
});
```

### Hook Testing
```typescript
// __tests__/hooks/useWallet.test.ts
import { renderHook, act } from '@testing-library/react';
import { useWallet } from '@/hooks/useWallet';

describe('useWallet', () => {
  it('initializes with disconnected state', () => {
    const { result } = renderHook(() => useWallet());
    expect(result.current.walletConnected).toBe(false);
  });
  
  it('handles connection attempts', () => {
    const { result } = renderHook(() => useWallet());
    
    act(() => {
      result.current.connectWallet();
    });
    
    expect(result.current.connectionAttempts).toBe(1);
  });
});
```

---

## 🚀 Deployment

### Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID": "@walletconnect-project-id"
  }
}
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=609f45d188c096567677077f5b0b4175
```

---

## 📊 Analytics & Monitoring

### Performance Monitoring
```typescript
// lib/analytics.ts
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Custom analytics
    console.log('Event:', eventName, properties);
  }
}

// Usage examples
trackEvent('file_uploaded', { fileType: 'pdf', size: 1024000 });
trackEvent('trust_score_generated', { score: 85.5 });
trackEvent('nft_minted', { tokenId: '123' });
```

### Error Tracking
```typescript
// lib/error-tracking.ts
export function trackError(error: Error, context?: Record<string, any>) {
  console.error('Error tracked:', error, context);
  
  // Send to error tracking service
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  }
}
```

---

*This frontend documentation provides a comprehensive overview of the Mintellect frontend architecture. For specific implementation details, refer to the individual component files.* 