import React from "react";

/**
 * Recovery UI for unexpected React render failures.
 * Does not swallow handler errors or replace Vite build diagnostics.
 */
export default class CafeErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, details) {
    // No private order or customer data is logged intentionally.
    if (import.meta.env.DEV) console.error("YOUR CAFÉ rendering error", error, details);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="yc-error-screen" role="alert" id="main-content">
        <section className="yc-error-card" aria-labelledby="yc-error-title">
          <p className="yc-error-eyebrow">YOUR CAFÉ / DEMO PREVIEW</p>
          <h1 id="yc-error-title">This cup needs a fresh start.</h1>
          <p>Something unexpected happened while rendering the website. Your browser's saved demonstration records have not been reset.</p>
          <div className="yc-error-actions">
            <button type="button" onClick={() => window.location.reload()}>Refresh the page</button>
            <a href="/">Return to homepage</a>
          </div>
          {import.meta.env.DEV && <details><summary>Developer error details</summary><pre>{String(this.state.error?.message || this.state.error)}</pre></details>}
          <small>Website Concept Made by: Web Developer Devin Planas</small>
        </section>
      </main>
    );
  }
}
