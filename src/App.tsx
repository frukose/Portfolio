/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Intersection Observer to highlight active navigation tab seamlessly on scroll
  useEffect(() => {
    const sectionsObj = ["hero", "projects", "experience", "contact"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -45% 0px", // Centered threshold trigger
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sectionsObj.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#e5e5e5] overflow-x-hidden selection:bg-[#c5a059]/30 selection:text-white" id="main-root">
      
      {/* Floating active nav header */}
      <Header activeSection={activeSection} />

      {/* Hero Entrance Layer */}
      <Hero />

      {/* Main Core Compartment Container */}
      <main className="relative z-10" id="content-compartment">
        
        {/* Projects showcases */}
        <Projects />

        {/* Experience history timeline */}
        <Experience />

        {/* Synchronous connection gateway */}
        <Contact />

      </main>

      {/* High concept minimal footer */}
      <footer className="bg-[#0c0c0c] border-t border-white/5 py-12 px-6" id="site-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo identity */}
          <div className="flex items-center gap-3">
            <div className="serif-display text-2xl font-light italic tracking-tight">
              FA<span className="text-[#c5a059]">.</span>
            </div>
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400">
              Farouk Ayomide Portfolio
            </span>
          </div>

          {/* Human credits */}
          <div className="font-sans text-[10px] uppercase tracking-[0.15em] text-neutral-500 text-center md:text-right">
            © 2026 Farouk Ayomide. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
