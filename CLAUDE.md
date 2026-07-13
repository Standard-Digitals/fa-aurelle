# FA ÀURELLE — Engineering Reference

Premium luxury hair care website. Every decision prioritizes quality, performance, and brand perception.

---

## Architecture

```
src/
├── app/              → Routes, layouts, pages (App Router)
│   ├── (marketing)/  → Public-facing route group
│   └── api/          → API routes
├── components/
│   ├── common/       → Shared components (e.g., Container, Section)
│   ├── layout/       → Header, Footer, Navigation
│   ├── sections/     → Page-level sections (Hero, About, etc.)
│   ├── three/        → R3F scenes, models, shaders
│   └── ui/           → Atomic primitives (Button, Text, Link)
├── config/           → Typed app configuration
├── constants/        → Raw design tokens and values
├── hooks/            → Custom React hooks
├── lib/              → Utility libraries (cn, etc.)
├── providers/        → Context providers
├── stores/           → Client state (Zustand if needed)
├── types/            → Shared TypeScript types
└── utils/            → Pure helper functions
public/
├── fonts/            → Self-hosted typefaces
├── icons/            → SVG icons
├── images/           → Optimized images
├── models/           → glTF/GLB 3D models
├── seo/              → OG images, favicons
├── textures/         → Three.js textures
└── videos/           → Background/hero videos
```

---

## Folder Conventions

- Static assets live in `public/` only — never in `src/`
- One component per file
- Colocate component-specific hooks and types with the component
- Barrel exports (`index.ts`) at folder level for clean imports
- Route groups use parentheses: `(marketing)`, `(auth)`

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `HeroSection.tsx` |
| Hooks | camelCase, `use` prefix | `useMediaQuery.ts` |
| Utils/Lib | camelCase | `formatDate.ts` |
| Constants | camelCase export, UPPER_SNAKE for env | `colors.ts`, `NEXT_PUBLIC_URL` |
| Types | PascalCase | `NavItem`, `SiteConfig` |
| Files | kebab-case | `smooth-scroll-provider.tsx` |
| CSS classes | Tailwind utilities | No custom class names unless unavoidable |

---

## Animation Guidelines

- Default duration: `0.6s–1.6s` (never below `0.3s`)
- Easing: custom cubic-bezier — no linear, no bounce
- GSAP for scroll-triggered timelines and complex sequences
- Framer Motion for layout animations and presence transitions
- Lenis for smooth scroll — never override with CSS `scroll-behavior`
- Three.js `useFrame` for per-frame 3D animations
- Stagger children with `0.1s–0.2s` delay
- Respect `prefers-reduced-motion` — disable non-essential animations

---

## Component Standards

- All components must be typed — no `any`
- Props interface defined above component or co-exported
- Use `cn()` from `@/lib/utils` for conditional classes
- Server Components by default — add `"use client"` only when required
- Wrap Three.js components in `dynamic()` with `ssr: false`
- Keep components under 100 lines — extract logic into hooks
- No inline styles except dynamic values from JS calculations

---

## Three.js Conventions

- All 3D components live in `src/components/three/`
- Use `@react-three/fiber` Canvas — never raw Three.js DOM mounting
- Use `@react-three/drei` helpers (Environment, Float, useGLTF, etc.)
- Preload models with `useGLTF.preload()`
- Compress models with glTF-Transform or Draco
- Keep draw calls minimal — instancing for repeated geometry
- Dispose resources in cleanup (`useEffect` return)
- Use `leva` controls only in development (`process.env.NODE_ENV`)

---

## Performance Rules

- Lighthouse target: 90+ on all metrics
- Images: use Next.js `<Image>` with `priority` on LCP
- Fonts: self-hosted, `font-display: swap`, preloaded
- Code split heavy libraries (`three`, `gsap`) with `dynamic()`
- Lazy load below-fold sections with `Suspense`
- Avoid layout shifts — explicit dimensions on media
- Bundle analysis: keep JS under 200KB first load
- Use `optimizePackageImports` in `next.config.ts`

---

## Accessibility Rules

- Semantic HTML: `<main>`, `<nav>`, `<section>`, `<article>`
- All images have descriptive `alt` text
- Interactive elements are keyboard focusable
- Focus-visible styles on all interactive elements
- ARIA labels on icon-only buttons
- Color contrast: WCAG AA minimum (easy with black/white palette)
- Skip-to-content link
- Reduced motion: respect `prefers-reduced-motion`
- Three.js Canvas: provide `aria-label` and fallback content

---

## Responsive Strategy

- Mobile-first approach
- Breakpoints: `640px`, `768px`, `1024px`, `1280px`, `1536px`
- Typography scales fluidly with `clamp()`
- Layout shifts from single column → editorial grid at `lg`
- Three.js scenes adapt: reduce complexity on mobile
- Touch targets: minimum `44px`
- Test at: 375px, 768px, 1024px, 1440px, 1920px

---

## Code Review Checklist

- [ ] TypeScript strict — no `any`, no type assertions without reason
- [ ] No unused imports or variables
- [ ] Components are Server Components unless client interaction required
- [ ] `cn()` used for conditional class merging
- [ ] No hardcoded strings — use constants/config
- [ ] Animations respect reduced motion
- [ ] Images use `<Image>` with explicit dimensions
- [ ] No console logs in production code
- [ ] Accessible — keyboard navigable, ARIA where needed
- [ ] Responsive — tested across breakpoints
- [ ] Performance — no unnecessary re-renders, memoize expensive ops
- [ ] Follows existing naming and folder conventions

---

## Future Roadmap

- [ ] CMS integration (Sanity or Contentful) for product content
- [ ] E-commerce layer (Shopify Storefront API)
- [ ] Internationalization (i18n)
- [ ] Analytics (Vercel Analytics / Plausible)
- [ ] A/B testing for landing pages
- [ ] PWA support
- [ ] Advanced 3D product configurator
- [ ] Video-driven storytelling sections
- [ ] Newsletter integration
- [ ] Admin dashboard for content management
