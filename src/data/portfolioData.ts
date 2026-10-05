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
export type CaseStudyAccent = 'amber' | 'bronze'

/** Top-of-page identity: who she is and what she does. */
export interface PersonalHeader {
  readonly name: string
  /** Path to the profile photo. Drop the real asset in `public/images/`. */
  readonly profileImage: string
  readonly title: string
  readonly headline: string
  readonly summary: string
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
    profileImage: '/images/estera-profile.jpg',
    title: 'Full-Stack Engineer & Solution Architect',
    headline: 'Crafting modern digital solutions with precision.',
    summary:
      'I design and ship production-grade frontend systems and the cloud architecture behind them — pairing deep React/TypeScript craft with AWS, CI/CD, and security-first delivery.',
    roleBadges: ['Frontend Engineering', 'AWS & Solution Architecture'],
  },

  github: 'https://github.com/eses-git',

  relocation: {
    currentLocations: ['Ecuador', 'Poland'],
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
        'High-performance, accessible interfaces built for scale — from pixel-accurate Figma hand-off to sub-second, animation-heavy experiences.',
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
        'End-to-end system design across cloud, APIs, and payments — infrastructure as code, secure delivery pipelines, and integrations that hold up under load.',
      skills: [
        'Requirements Analysis',
        'AWS & Cloud Infrastructure',
        'RESTful API Architecture',
        'PHP Yii2 & Python Backends',
        'Vercel CI/CD & Cloudflare',
        'Stakeholder Alignment & E2E',
        
      ],
    },
  ],

 techMatrix: [
    {
      id: 'fullstack-frontend',
      title: 'Full-Stack & Frontend Core',
      description:
        'Typed interfaces and application layers built for speed, accessibility, and maintainable component architecture.',
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
      title: 'AWS & Backend Architecture',
      description:
        'Cloud infrastructure, serverless microservices, and database query modeling engineered for performance under load.',
      icon: 'cloud',
      items: [
        'AWS (S3, API Gateway)',
        'CloudFront & Route53',
        'PHP Yii2 Framework',
        'Python (FastAPI)',
        'MySQL & Memgraph DB',
        'Stripe & PayPal Gateways',
      ],
    },
    {
      id: 'devops-security',
      title: 'DevOps & Cloud Security',
      description:
        'Automated delivery pipelines, edge security, domain routing, and production Linux environment management.',
      icon: 'shield',
      items: [
        'GitHub Actions & Vercel CI/CD',
        'Cloudflare DNS & DDoS Protection',
        'Linux (Ubuntu / Apache / Nginx)',
        'Bash Scripting & Automation',
        'SSL / TLS Termination',
        'Git Workflow & Release Mgmt',
      ],
    },
  ],

  caseStudies: [
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
      role: 'Frontend / Full-Stack Software Engineer',
      period: 'Oct 2019 — Present',
      location: 'Ecuador & International Remote',
      summary:
        'Architecting and delivering production-ready web applications, responsive user interfaces, and secure cloud setups for international clients — turning Figma wireframes into performance-tuned frontend systems.',
      highlights: [
        'Engineered custom 60 FPS HTML5 Canvas rendering engines in React and TypeScript, delivering dense visual background dynamics while avoiding DOM reflow overhead',
        'Architected RESTful services and backend integrations in PHP (Yii2 framework) and Python, connecting relational MySQL databases with modern frontend layers',
        'Integrated Stripe and PayPal payment gateway APIs with backend service layers and webhook listeners',
        'Configured automated CI/CD deployment pipelines on Vercel and secured client infrastructure with Cloudflare DDoS mitigation, SSL encryption, and DNS routing',
        'Utilized advanced AI tooling (Claude, Gemini, ChatGPT, Cline Agent) to accelerate system design, unit test generation, and code refactoring',
        'Designed and delivered end-to-end web projects on WordPress and Wix platforms',
        'Diagnosed and resolved performance and technical issues across existing websites, executing seamless domain and server migrations',
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