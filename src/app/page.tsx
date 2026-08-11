"use client";

import dynamic from "next/dynamic";
import { useScrollProgress } from "@/lib/scroll-progress";
import Nav from "@/components/nav/Nav";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Projects from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";
import SceneErrorBoundary from "@/components/scene/SceneErrorBoundary";

// Client-only, dynamically imported so the R3F/three.js bundle never runs
// (or ships) during SSR — `ssr: false` is only valid inside a Client
// Component, which is why this whole page is "use client".
const Scene = dynamic(() => import("@/components/scene/Scene"), {
  ssr: false,
  loading: () => <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, background: "#fcfcfb" }} />,
});

export default function Home() {
  // Single shared 0–1 scroll-progress source of truth: drives both the
  // persistent 3D camera flythrough and the nav's active-section state.
  const progress = useScrollProgress();

  return (
    <>
      <SceneErrorBoundary>
        <Scene progress={progress} />
      </SceneErrorBoundary>
      <div className="hud-grid-overlay" aria-hidden="true" />
      <Nav progress={progress} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
