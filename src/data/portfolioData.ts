/**
 * portfolioData.ts
 *
 * Single, strongly-typed source of truth for the portfolio content.
 * Consumed by presentational components (e.g. `src/components/Hero.tsx`).
 *
 * Notes on conventions:
 * - `erasableSyntaxOnly` is enabled in tsconfig, so no enums/namespaces here;
 *   we use union types + `const` structures instead.
 * - The module has no runtime dependencies and is fully tree-shakeable.
 */

/** Stable identifiers for the two professional pillars. */
export type PillarId = 'frontend-engineering' | 'solution-architecture'

/** Accent tokens used to theme individual case studies in the UI. */
export type CaseStudyAccent = 'amber' | 'bronze' | 'emerald'

/** Top-of-page identity: who she is and what she does. */
export interface PersonalHeader {
  readonly name: string
  /** Path to the profile photo. Drop the real asset in `public/images/`. */
  readonly profileImage: string
  readonly title: string
  readonly headline: string
  readonly summary: string
  readonly footerdesc:string
  /** Short labels rendered as dual-role badges. */
  readonly roleBadges: readonly string[]
}

/** Relocation + language context, surfaced as a prominent badge. */
export interface RelocationBadge {
  /** Where she is currently based (multi-region). */
  readonly currentLocations: readonly string[]
  readonly destination: string
  /** Human-readable relocation window, e.g. "Q4 2026". */
  readonly timeline: string
  /** Language names suitable for compact chips. */
  readonly languages: readonly string[]
  readonly availability: string
  readonly nationality: string
}

/** One of the two core professional pillars. */
export interface CorePillar {
  readonly id: PillarId
  readonly title: string
  readonly description: string
  readonly skills: readonly string[]
}

/** Icon keys the UI maps to a Lucide component (keeps this data framework-agnostic). */
export type TechGroupIcon = 'code' | 'cloud' | 'shield'

/** A single column of the technology matrix (e.g. "AWS & Backend Architecture"). */
export interface TechCategory {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: TechGroupIcon
  readonly items: readonly string[]
}

/** A featured, deep-dive project. */
export interface CaseStudy {
  readonly id: string
  readonly name: string
  readonly subtitle: string
  /** Her role on the engagement. */
  readonly role: string
  readonly summary: string
  /** Architecture & cloud infrastructure notes for the deep-dive tab. */
  readonly architecture: readonly string[]
  readonly highlights: readonly string[]
  readonly stack: readonly string[]
  /** Optional source repository link. */
  readonly githubUrl?: string
  /** Optional deployed / live site link. */
  readonly liveUrl?: string
  readonly accent: CaseStudyAccent
}

/** A single role in the professional timeline. */
export interface ExperienceEntry {
  readonly company: string
  readonly role: string
  /** Free-form display range, e.g. "Oct 2019 — Present". */
  readonly period: string
  readonly location: string
  readonly summary: string
  readonly highlights: readonly string[]
}

/** Root shape exported to the app. */
export interface PortfolioData {
  readonly header: PersonalHeader
  /** Top-level social/profile links. */
  readonly github: string
  readonly relocation: RelocationBadge
  readonly pillars: readonly CorePillar[]
  readonly techMatrix: readonly TechCategory[]
  readonly caseStudies: readonly CaseStudy[]
  readonly experience: readonly ExperienceEntry[]
}

export const portfolioData: PortfolioData = {
  header: {
    name: 'Estera Bulkiewicz',
    profileImage: '/images/foto3.jpg',
    title: 'Full-Stack Engineer & Solution Architect',
    footerdesc:'Looking for Full-Stack Engineer and Solution Architect roles in Spain, remote or on-site. Available now.',
    headline: 'Full-stack development for the modern world.',
    summary:
      'I design and ship production-grade frontend systems and the cloud architecture behind them — pairing deep React/TypeScript craft with AWS, CI/CD, and security-first delivery.',
    roleBadges: ['Frontend Engineering', 'AWS & Solution Architecture'],
  },

  github: 'https://github.com/eses-git',

  relocation: {
    currentLocations: ['Ecuador', 'Poland','Spain'],
    nationality:'Polish',
    destination: 'Spain',
    timeline: 'Q4 2026',
    languages: ['English', 'Spanish', 'Polish'],
    availability:
      'Open to Full-Stack Engineer & Solution Architect roles in Spain from Q4 2026.',
  },

  pillars: [
    {
      id: 'frontend-engineering',
      title: 'Frontend Engineering',
      description:
        'I build fast, accessible interfaces, from turning Figma designs into pixel-accurate pages to animation-heavy experiences that still load in under a second. I rely on real profiling data, not guesses.',
      skills: [
        'React & Next.js Architecture',
        'TypeScript & Modern JS',
        'HTML5 Canvas & Motion',
        'Tailwind & Design Systems',
        'Chrome DevTools Profiling',
        'Core Web Vitals Optimization',
      ],
    },
    {
      id: 'solution-architecture',
      title: 'Solution Architecture',
      description:
        'I design the systems behind the interface: cloud setup, APIs, and payment integrations. I like to start from the requirements and finish with a deployment pipeline I can trust under real traffic.',
      skills: [
        'Requirements Analysis',
        'AWS & Cloud Infrastructure',
        'RESTful API Architecture',
        'PHP Yii2 & Python Backends',
        'Vercel CI/CD & Cloudflare',
        'Payment Integrations',
        
      ],
    },
  ],

 techMatrix: [
    {
      id: 'fullstack-frontend',
      title: 'Frontend Core',
      description:
        'I build with React, Next.js, and TypeScript, with a focus on fast pages, accessibility, and components that are easy to maintain.',
      icon: 'code',
      items: [
        'React & Next.js',
        'TypeScript',
        'Vite',
        'HTML5 Canvas API',
        'Tailwind CSS',
        'REST & GraphQL APIs',
      ],
    },
    {
      id: 'aws-backend',
      title: 'Cloud & Backend',
      description:
        'I set up AWS services and write backends in PHP, Python and React, along with the databases and payment integrations they rely on.',
      icon: 'cloud',
      items: [
        'AWS (S3, API Gateway)',
        'CloudFront & Route53',
        'PHP',
        'Python (FastAPI)',
        'MySQL, MariaDB, noSQL',
        'Stripe & PayPal integrations',
      ],
    },
    {
      id: 'devops-security',
      title: 'DevOps & Cloud Security',
      description:
        'I manage deployments, DNS, and Linux servers, and protect sites with SSL and DDoS filtering so releases stay safe and predictable.',
      icon: 'shield',
      items: [
        'GitHub Actions & Vercel CI/CD',
        'Cloudflare DNS & DDoS Protection',
        'Linux (Ubuntu / Apache / Nginx)',
        'Bash Scripting & Automation',
        'SSL / TLS Setup',
        'Git Workflow & Release',
      ],
    },
  ],

  caseStudies: [
    {
      id: 'saas-analysis-suite',
      name: 'Enterprise SaaS Analytics & Spreadsheet Extraction Suite',
      subtitle: 'Version 1.0 — In Active Development',
      role: 'Creator & Independent Full-Stack Engineer',
      summary:
        'A high-performance, fully client-side web application for uploading, parsing, analyzing, and visualizing SaaS and E-Commerce spreadsheet datasets — with zero server roundtrips. Every file is ingested entirely in browser memory, guaranteeing no transmission to third-party servers.',
      architecture: [
        'Asynchronous in-memory ingestion pipeline parsing .csv (PapaParse) and .xls/.xlsx (SheetJS) into a unified, strictly-typed ParsedDataset model',
        'Automated schema & dynamic type inference classifying columns (number, date, boolean, string) by sampling up to 100 rows',
        'Interactive Recharts analytics — dynamic Area/Trend, Bar, and Donut charts with persistent color palettes synchronized across fills, icons, and UI accents',
        'Enterprise TanStack Table v8 DataGrid with debounced global search, numeric/date-aware sorting, pagination, and column-visibility toggles',
        '100% client-side memory processing guaranteeing zero file transmission to third-party servers',
      ],
      highlights: [
        'Zero-server-roundtrip processing — files never leave browser RAM and are never transmitted to any server',
        'Smart type inference handling currency symbols ($/€/£/¥), thousands separators, ISO/MM/DD/YYYY date recognition, and camelCase header sanitization',
        'Extraction & reporting views: schema inspection tables, raw row review, numeric quick-metrics, and print/PDF-optimized executive summaries with copy-to-clipboard support',
        'Customizable persistent color palettes (Mint Emerald default, Cyber Indigo, Ocean Cyan, Sunset Amber) synchronized across chart fills, icons, and UI accents',
      ],
      stack: [
        'React 19',
        'TypeScript',
        'Vite',
        'Tailwind CSS v4',
        'Zustand',
        'TanStack Table v8',
        'SheetJS (xlsx)',
        'PapaParse',
        'Recharts',
        'Lucide Icons',
      ],
      githubUrl: 'https://github.com/eses-git/saas-analysis-suite',
      liveUrl:'https://saas-analysis-suite.estera-bulkiewicz.workers.dev/',
      accent: 'emerald',
    },
    {
      id: 'xhiva-ltd',
      name: 'XHIVA Ltd',
      subtitle: 'Interactive HTML5 Canvas experience',
      role: 'Frontend Engineer & Performance Lead',
      summary:
        'A performance-obsessed marketing site whose background animation runs on a single requestAnimationFrame loop, deployed directly from GitHub to Cloudflare edge infrastructure.',
      architecture: [
        'Single requestAnimationFrame render loop driving the entire Canvas scene',
        'Zero third-party runtime dependencies keeps main-thread work predictable',
        'Automated CI/CD build pipeline deploying directly from GitHub repository to Cloudflare Pages',
      ],
      highlights: [
        'Single requestAnimationFrame loop drives the entire Canvas animation for maximum frame performance',
        'Zero-dependency rendering path keeps main-thread work predictable',
        'Deployed via GitHub integration to Cloudflare edge network for instant, globally cached delivery',
      ],
      stack: ['HTML5 Canvas API', 'requestAnimationFrame', 'JavaScript', 'GitHub Actions', 'Cloudflare Pages'],
      githubUrl: 'https://github.com/eses-git/xhivaweb',
      accent: 'amber',
      liveUrl: 'https://xhiva.org/'
    },
 {
      id: 'interactiva-cuenca',
      name: 'Interactiva Cuenca',
      subtitle: 'Figma-to-production React platform',
      role: 'Frontend Engineer & Solution Architect',
      summary:
        'A production React application built from Figma designs to live deployment, wired through automated GitHub-to-Vercel CI/CD and enterprise-grade Cloudflare DNS/DDoS protection.',
      architecture: [
        'Figma-to-production React front end mapped to a reusable component system',
        'Automated CI/CD pipeline triggering preview and production builds directly from GitHub to Vercel',
        'Enterprise Cloudflare DNS configuration with edge DDoS protection and SSL termination',
      ],
      highlights: [
        'Figma-to-production React build wired through a seamless GitHub-to-Vercel deployment pipeline',
        'Modular component architecture ensuring rapid iteration and maintainability',
        'Enterprise Cloudflare DNS and DDoS security layers securing edge delivery',
      ],
      stack: ['React', 'Figma', 'GitHub Actions', 'Vercel', 'Cloudflare'],
      githubUrl: 'https://github.com/eses-git/interactivacuenca2',
      liveUrl: 'https://interactivacuen-git-d0a474-sarainteractivacuenca-2720s-projects.vercel.app/',
      accent: 'bronze',
    },
    {
      id: 'vilca-seguros',
      name: 'Vilca Seguros — Complete Digital Identity & Platform',
      subtitle:
        'End-to-End Website Strategy, Custom WordPress Design & Production',
      role: 'Full-Stack Architect & Designer (Executed 100% End-to-End)',
      summary:
        'Architected and delivered the entire brand web presence, including custom lead-intake workflows, mobile-first responsive interfaces, and optimized server loading performance.',
      architecture: [
        'Bespoke brand web presence designed and engineered ground-up',
        'Custom lead-intake workflows built for the enquiry journey',
        'Mobile-first responsive interfaces across every template',
        'Optimized server loading performance with an SEO & security baseline',
      ],
      highlights: [
        'Conceived and engineered the complete brand web presence and user experience',
        'Custom lead-intake workflows and mobile-first responsive interfaces',
        'Optimized server loading performance across the production stack',
      ],
      stack: [
        'WordPress',
        'PHP',
        'Custom Theme Development',
        'CSS3',
        'SEO & Security',
      ],
      liveUrl: 'https://vilcaseguros.com/',
      accent: 'amber',
    },
  ],

  experience: [
    {
      company: 'Independent Consulting',
      role: 'Full-Stack Software Engineer',
      period: 'Oct 2019 — Present',
      location: 'Ecuador & International Remote',
      summary:
        'I work independently with international clients, covering everything from the Figma hand-off to the frontend, backend, payments, and hosting.',
      highlights: [
        "Built custom HTML5 Canvas animation engines in React and TypeScript that run at 60 FPS without touching the DOM, so heavy visual backgrounds don't slow pages down.",
        'Developed REST APIs and backend services in PHP (Yii2) and Python, connected to MySQL and used by modern frontends.',
        'Integrated Stripe and PayPal payment gateway APIs with backend service layers.',
        'Set up CI/CD pipelines on Vercel, Cloudflare workers and secured client sites with Cloudflare (DDoS protection, SSL, DNS).',
        'Utilized advanced AI tooling (Claude, Gemini, ChatGPT, Cline Agent) to accelerate system design, unit test generation, and code refactoring.',
        'Delivered WordPress and Wix sites, fixed performance problems on existing ones, and migrated domains and servers.',
        'Diagnosed and resolved performance and technical issues across existing websites, executing seamless domain and server migrations',
        'Lead projects from the first call to launch: gather requirements, propose solutions, and keep clients updated in English and Spanish.'
      ],
    },
    {
      company: 'Cube Group S.A.',
      role: 'PHP / Full-Stack Software Engineer',
      period: 'Aug 2015 — Jun 2019',
      location: 'Warsaw, Poland',
      summary:
        'Led backend application development, database architecture, and big-data reporting pipelines for enterprise e-commerce platforms and marketing applications.',
      highlights: [
        'Engineered automated reporting engines processing and exporting structured datasets containing tens of thousands of records without memory overhead',
        'Designed and optimized relational MySQL database schemas using MySQL Workbench',
        'Developed RESTful APIs, XML schemas, and JSON data pipelines integrated with enterprise ERP software systems',
        'Managed Linux (Ubuntu) Apache2 server environments, cPanel configurations, and automated administration tasks using Bash scripts',
      ],
    },
    {
      company: 'Ce5',
      role: 'Junior Software Developer',
      period: 'Jul 2014 — Aug 2015',
      location: 'Poland',
      summary:
        'Developed custom MVC web application modules, database schemas, and newsletter distribution systems during Agile development sprints.',
      highlights: [
        'Built custom modules and framework extensions using PHP (Yii framework) and Composer dependency management',
        'Maintained relational MySQL databases and delivered feature updates directly to clients during iterative Agile sprints',
      ],
    },
    {
      company: 'WB Electronics',
      role: 'Junior Programmer',
      period: 'Feb 2013 — Dec 2013',
      location: 'Poland',
      summary:
        'Authored technical documentation for specialized military software modules and C applications.',
      highlights: [
        'Produced comprehensive technical documentation for core application components written in C',
      ],
    },
    {
      company: 'Sunbajt Sp. z o.o.',
      role: 'PHP Programmer',
      period: 'Aug 2012 — Feb 2013',
      location: 'Poland',
      summary:
        'Built custom web applications in structured PHP and MySQL relational databases.',
      highlights: [
        'Architected structured PHP application layers connected to relational MySQL databases without external framework overhead',
        'Provided direct technical support and communicated features to business users',
      ],
    },
    {
      company: 'Luxbit',
      role: 'Programmer',
      period: 'Apr 2010 — Apr 2012',
      location: 'Poland',
      summary:
        'Engineered specialized software interfaces and financial/accounting libraries.',
      highlights: [
        'Wrote accounting software modules in Clipper FlagShip and HTML interface components in C++',
        'Documented technical libraries, programs, and system functions',
      ],
    },
  ],
}