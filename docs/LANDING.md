# Mintellect - Landing Page Documentation

## 🎯 Landing Page Overview

The Mintellect landing page serves as the primary marketing and user acquisition platform, showcasing the AI-powered academic integrity platform's features, capabilities, and value proposition.

### 🏗️ Technology Stack

#### Core Framework
- **Next.js 15.4.5** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **TailwindCSS 3.4.17** - Utility-first CSS framework

#### UI & Animations
- **Framer Motion** - Advanced animations and interactions
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

#### Web3 Integration
- **RainbowKit 2.2.8** - Wallet connection UI
- **Wagmi 2.16.0** - React hooks for Ethereum
- **Viem 2.33.2** - TypeScript interface for Ethereum

---

## 📁 Project Structure

### Main Landing Page Structure
```
landing/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main landing page
│   ├── globals.css          # Global styles
│   ├── login/               # Login page
│   │   └── page.tsx         # Login interface
│   ├── redirect/            # Redirect handling
│   │   └── page.tsx         # Redirect logic
│   └── api/                 # API routes
│       ├── auth/            # Authentication endpoints
│       │   ├── login/       # Login endpoint
│       │   └── register/    # Registration endpoint
│       └── dashboard/       # Dashboard endpoint
├── client/                  # Client-specific landing
│   ├── app/                 # Client app routes
│   │   ├── page.tsx         # Client dashboard
│   │   ├── layout.tsx       # Client layout
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── plagiarism/      # Plagiarism detection
│   │   ├── trust-score/     # Trust score generation
│   │   ├── review/          # Review interface
│   │   └── user-token/      # User token management
│   ├── components/          # Client components
│   ├── lib/                 # Client utilities
│   ├── hooks/               # Client hooks
│   └── config/              # Client configuration
├── components/              # Shared components
│   ├── landing-page.tsx     # Main landing component
│   ├── navbar.tsx           # Navigation bar
│   ├── page-loader.tsx      # Loading component
│   ├── theme-provider.tsx   # Theme management
│   ├── OCConnectWrapper.tsx # OCID connection wrapper
│   └── ui/                  # UI components
├── lib/                     # Utilities
├── hooks/                   # Custom hooks
├── styles/                  # Additional styles
└── public/                  # Static assets
```

---

## 🎨 Landing Page Components

### Main Landing Page (`components/landing-page.tsx`)

The main landing page component is a comprehensive marketing page with multiple sections:

#### Hero Section
```typescript
// Hero section with animated background and call-to-action
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <GridBackground />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The Future of Research.
          <span className="text-mintellect-primary"> On-Chain.</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI-powered research publishing platform where innovation meets credibility
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/login" className="btn-primary">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <button className="btn-secondary">
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
};
```

#### Workflow Steps Section
```typescript
const WORKFLOW_STEPS = [
  {
    title: "Upload",
    description: "Upload LaTeX, PDF, or Word documents.",
    icon: FileCheck,
  },
  {
    title: "Analyze",
    description: "AI checks originality and academic integrity.",
    icon: Shield,
  },
  {
    title: "Verify",
    description: "Receive trust score and detailed analysis.",
    icon: Award,
  },
  {
    title: "Human Review",
    description: "Real researchers from the community review your paper.",
    icon: Users,
  },
  {
    title: "Certify",
    description: "Mint NFT certificate as proof of verified work.",
    icon: BookOpen,
  },
];

const WorkflowSection = () => {
  return (
    <section className="py-20 bg-black/50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          How It Works
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {WORKFLOW_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-mintellect-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="h-8 w-8 text-mintellect-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

#### AI Capabilities Section
```typescript
const AI_CAPABILITIES = [
  {
    title: "Multi-Agent Verification System",
    description: "Our specialized AI agents work collaboratively to verify research integrity with unprecedented accuracy",
    icon: Brain,
    link: "#neural-text-analysis",
  },
  {
    title: "Plagiarism Detection",
    description: "99.7% accuracy across academic databases.",
    icon: FileSearch,
    link: "#plagiarism-detection",
  },
  {
    title: "Citation Analysis",
    description: "Validates references against trusted sources.",
    icon: ScrollText,
    link: "#citation-analysis",
  },
];

const AICapabilitiesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI-Powered Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AI_CAPABILITIES.map((capability, index) => (
            <motion.div
              key={capability.title}
              className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <capability.icon className="h-12 w-12 text-mintellect-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
              <p className="text-gray-400">{capability.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### Navigation Bar (`components/navbar.tsx`)

The navigation bar provides seamless navigation and wallet connection:

```typescript
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hoverLink, setHoverLink] = useState<string | null>(null);
  
  // Navigation items
  const navItems = [
    {
      name: "Telegram",
      href: "https://t.me/mintellect_community",
      icon: TelegramIcon,
      external: true,
    },
    {
      name: "X",
      href: "https://x.com/_Mintellect_",
      icon: TwitterIcon,
      external: true,
    },
  ];
  
  return (
    <motion.nav
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <AnimatedLogo className="h-8 w-8" />
            <span className="text-xl font-bold">Mintellect</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                onHoverStart={() => setHoverLink(item.name)}
                onHoverEnd={() => setHoverLink(null)}
              >
                {item.icon}
                <span>{item.name}</span>
              </motion.a>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="btn-primary">
              Get Started
            </Link>
            <button className="md:hidden" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile menu content */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
```

---

## 🎭 Animation & Interactions

### Scroll-Based Animations
```typescript
// Scroll-triggered animations using Framer Motion
const ScrollAnimation = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  return (
    <motion.div style={{ y }}>
      {/* Animated content */}
    </motion.div>
  );
};
```

### Mouse-Following Effects
```typescript
// Mouse-following glow effect
const MouseGlowEffect = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0, 212, 255, 0.1), transparent 40%)`
      }}
    />
  );
};
```

### Text Animations
```typescript
// Typewriter effect for hero text
const TypewriterText = ({ words }: { words: string[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText === word) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);
  
  return (
    <span className="text-mintellect-primary">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};
```

---

## 🔗 Client Integration

### Client Landing Page (`client/app/page.tsx`)

The client landing page provides a specialized interface for authenticated users:

```typescript
export default function ClientPage() {
  const { walletConnected, walletAddress } = useWallet();
  
  if (!walletConnected) {
    return <WalletConnectionPrompt />;
  }
  
  return (
    <div className="min-h-screen bg-black">
      <ClientLayout>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Mintellect
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Document Verification"
              description="Upload and verify your research papers"
              icon={FileCheck}
              href="/dashboard"
            />
            <FeatureCard
              title="Trust Score"
              description="Generate AI-powered trust scores"
              icon={Shield}
              href="/trust-score"
            />
            <FeatureCard
              title="NFT Certificates"
              description="Mint verified research as NFTs"
              icon={Award}
              href="/nft-gallery"
            />
          </div>
        </div>
      </ClientLayout>
    </div>
  );
}
```

### OCID Connection Wrapper (`components/OCConnectWrapper.tsx`)

Handles On-Chain ID (OCID) integration:

```typescript
export function OCConnectWrapper({ children }: { children: React.ReactNode }) {
  const [ocidConnected, setOcidConnected] = useState(false);
  
  useEffect(() => {
    // Check OCID connection status
    const checkOcidConnection = async () => {
      try {
        // OCID connection logic
        setOcidConnected(true);
      } catch (error) {
        console.error('OCID connection failed:', error);
      }
    };
    
    checkOcidConnection();
  }, []);
  
  return (
    <OcidProvider>
      {children}
    </OcidProvider>
  );
}
```

---

## 🎨 Styling & Theming

### Custom CSS Variables
```css
/* globals.css */
:root {
  --mintellect-primary: #00D4FF;
  --mintellect-secondary: #FF6B6B;
  --mintellect-accent: #4ECDC4;
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
}
```

### Custom Animations
```css
/* Custom keyframe animations */
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
// Example: Responsive hero section
const HeroSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className={cn(
          "font-bold mb-6",
          isMobile ? "text-4xl" : "text-5xl md:text-7xl"
        )}>
          The Future of Research.
          <span className="text-mintellect-primary"> On-Chain.</span>
        </h1>
        
        <p className={cn(
          "mb-8",
          isMobile ? "text-lg" : "text-xl md:text-2xl"
        )}>
          AI-powered research publishing platform where innovation meets credibility
        </p>
        
        <div className={cn(
          "gap-4",
          isMobile ? "flex flex-col" : "flex flex-row"
        )}>
          <Link href="/login" className="btn-primary">
            Get Started
          </Link>
          <button className="btn-secondary">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};
```

---

## 🚀 Performance Optimizations

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
```

### Bundle Optimization
```javascript
// next.config.mjs
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

---

## 📊 Analytics & Tracking

### Performance Monitoring
```typescript
// Performance tracking
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
trackEvent('landing_page_viewed', { section: 'hero' });
trackEvent('cta_clicked', { button: 'get_started' });
trackEvent('feature_viewed', { feature: 'ai_capabilities' });
```

### Conversion Tracking
```typescript
// Conversion tracking for marketing
const trackConversion = (type: string, value?: number) => {
  trackEvent('conversion', {
    type,
    value,
    timestamp: new Date().toISOString()
  });
};

// Track different conversion types
trackConversion('signup', 1);
trackConversion('demo_watch', 0.5);
trackConversion('feature_use', 0.3);
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
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

---

## 📈 SEO & Marketing

### Meta Tags
```typescript
// Metadata configuration
export const metadata: Metadata = {
  title: "Mintellect - AI-Powered Academic Integrity Platform",
  description: "Verify, improve, and certify your academic work with Mintellect's AI-powered platform.",
  keywords: [
    "academic integrity",
    "plagiarism detection",
    "research verification",
    "NFT certificates",
    "AI-powered analysis",
    "blockchain research"
  ],
  authors: [{ name: "Mintellect Team" }],
  creator: "Mintellect",
  publisher: "Mintellect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mintellect.xyz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Mintellect - AI-Powered Academic Integrity Platform",
    description: "Verify, improve, and certify your academic work with Mintellect's AI-powered platform.",
    url: 'https://mintellect.xyz',
    siteName: 'Mintellect',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mintellect Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mintellect - AI-Powered Academic Integrity Platform",
    description: "Verify, improve, and certify your academic work with Mintellect's AI-powered platform.",
    images: ['/images/twitter-image.png'],
    creator: '@_Mintellect_',
  },
};
```

### Structured Data
```typescript
// JSON-LD structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Mintellect",
  "description": "AI-powered academic integrity platform",
  "url": "https://mintellect.xyz",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Mintellect"
  }
};
```

---

*This landing page documentation provides a comprehensive overview of the Mintellect landing page architecture. For specific implementation details, refer to the individual component files.* 