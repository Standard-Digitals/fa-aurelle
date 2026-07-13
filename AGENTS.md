# FA ÀURELLE — AI Agent Instructions

This file is the permanent instruction manual for every AI assistant working on this project.

## Project

**FA ÀURELLE** — Luxury Hair Care Brand

## Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- GSAP
- Three.js + React Three Fiber + Drei
- Framer Motion
- Lenis (smooth scroll)

## Design Philosophy

- Luxury, minimal, editorial
- Inspired by: Apple, Aesop, Dyson, Rimowa, Loewe
- No cheap ecommerce layouts
- Every section must feel premium
- Large whitespace, cinematic pacing
- Product showcase over product listing

## Color Rules

- Primary: `#000000`
- Secondary: `#FFFFFF`
- Accent: Very subtle warm neutral — only when absolutely necessary
- No bright colors
- No gradients except realistic lighting on 3D objects

## Typography

- Elegant, editorial
- Large whitespace between elements
- Premium spacing and tracking
- Uppercase for headings when appropriate
- Light font weights preferred

## Animation Rules

- Slow, smooth, cinematic
- GSAP timelines for complex sequences
- Three.js for 3D interactions
- Mouse parallax
- Scroll-driven storytelling
- Framer Motion for UI transitions
- No fast/bouncy/playful animations

## Code Rules

- Production-ready, enterprise quality
- Reusable, modular components
- Strong TypeScript — no `any`, explicit types
- SEO friendly (semantic HTML, metadata)
- Accessible (ARIA, keyboard navigation)
- Performance optimized (lazy loading, code splitting)
- Never generate beginner-level code
- Follow existing project architecture and patterns
- Import alias: `@/*` maps to `./src/*`
- Constants in `src/constants/`, config in `src/config/`
- Static assets in `public/` only — never in `src/`
