/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface HeaderProps {
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center" id="nav-container">
        {/* Logo / Branded Initials */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="serif-display text-2xl font-black italic tracking-tight text-white group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-400 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            FA<span className="text-cyan-400 group-hover:text-pink-500">.</span>
          </div>
        </a>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/40 p-1 rounded-full border border-white/5 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-4 py-2 font-mono text-[10px] font-bold tracking-[0.1em] uppercase transition-colors duration-300 ${
                  isActive ? "text-cyan-300 font-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavBackground"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full z-[-1] border border-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Contact/CTA Button */}
        <a
          href="#contact"
          className="relative px-5 py-2 rounded-full font-mono text-[10px] font-bold tracking-widest text-[#e5e5e5] uppercase border border-cyan-500/35 hover:border-pink-500 hover:text-pink-400 transition-all duration-300 bg-cyan-950/10 shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
        >
          Let's Build
        </a>
      </div>
    </motion.header>
  );
};
