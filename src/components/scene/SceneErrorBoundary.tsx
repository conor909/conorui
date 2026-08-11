"use client";

import { Component, type ReactNode } from "react";
import styles from "./Scene.module.scss";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Minimal error boundary around the dynamically-imported `Scene`. If the
 * R3F/three.js chunk fails to load, or anything inside the scene throws
 * during render, the page falls back to the same static background used
 * when WebGL is unavailable — rather than crashing/white-screening the
 * whole page — per the spec's "render a static fallback instead of
 * crashing" boundary.
 */
export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Scene failed to render; falling back to static background.", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <div className={styles.fallback} aria-hidden="true" />;
    }
    return this.props.children;
  }
}
