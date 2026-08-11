# Conor McGrath — Portfolio

A single-page portfolio site built with Next.js (App Router) + TypeScript + SCSS. The
landing page is one continuous scroll across four sections — Hero, About, Projects,
Contact — with a persistent 3D WebGL scene (React Three Fiber) behind the whole page:
scroll position drives a camera flythrough, cursor movement adds secondary reactivity,
and section content reveals in sync using Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build (must complete with zero type errors)
npm run lint    # ESLint
```

## Editing content

All copy, profile info, bio, project data, and contact links live in one typed module:

- `src/content/site.ts`

Edit that file to change any text on the site — name, role, bio, project descriptions,
contact links, nav labels — without touching any component code.

Placeholder project images live under `public/projects/`. Swap those files (and update
the `image` path for each project in `src/content/site.ts`) once real screenshots are
available.

## Notes

- The 3D scene falls back to a static background if WebGL is unavailable, if the GPU
  context is lost after load, or if the scene fails to render for any other reason.
- The site respects `prefers-reduced-motion`: the scene holds a static frame and section
  reveals become simple fades.
- The contact form is client-side only — no backend, no network call, no data
  persistence. Submitting shows a local success state.
