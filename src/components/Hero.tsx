/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { LucideIcon } from "./LucideIcon";

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Use framer motion scroll tracker just for scroll-driven parallax triggers
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mouse for canvas interaction and magnetic pull
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Interactive Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particles setup
    const particleCount = 70;
    const colorsList = ["#38bdf8", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6", "#f43f5e", "#00ffcc", "#ff007f"];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.3,
        color: colorsList[i % colorsList.length],
      });
    }

    // Capture current coordinates in local ref to avoid re-binding effect
    let mouseRef = { x: -1000, y: -1000 };
    const updateMouseRef = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.x = e.clientX - rect.left;
      mouseRef.y = e.clientY - rect.top;
    };
    const clearMouseRef = () => {
      mouseRef.x = -1000;
      mouseRef.y = -1000;
    };

    canvas.parentElement?.addEventListener("mousemove", updateMouseRef);
    canvas.parentElement?.addEventListener("mouseleave", clearMouseRef);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render star grid lines subtle backing
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 65;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render connected constellations
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        
        // Float movement
        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interaction with mouse repulsion
        if (mouseRef.x > -1000) {
          const dx = p.x - mouseRef.x;
          const dy = p.y - mouseRef.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const force = (130 - dist) / 130;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        // Draw particle
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.85;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const opacity = (100 - dist) / 100 * 0.15;
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw faint cursor tracking glowing orb inside canvas
      if (mouseRef.x > -1000) {
        ctx.save();
        ctx.beginPath();
        const radGrd = ctx.createRadialGradient(
          mouseRef.x,
          mouseRef.y,
          0,
          mouseRef.x,
          mouseRef.y,
          220
        );
        radGrd.addColorStop(0, "rgba(236, 72, 153, 0.05)"); // Pink aura
        radGrd.addColorStop(0.5, "rgba(56, 189, 248, 0.02)"); // Cyan halo
        radGrd.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radGrd;
        ctx.arc(mouseRef.x, mouseRef.y, 220, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.parentElement?.removeEventListener("mousemove", updateMouseRef);
      canvas.parentElement?.removeEventListener("mouseleave", clearMouseRef);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Parallax translating variables
  const starsOffsetY = scrollY * 0.45;
  const contentOffsetY = scrollY * 0.12;
  const glintRotateY = (coords.x - window.innerWidth / 2) * 0.015;
  const glintRotateX = (coords.y - window.innerHeight / 2) * -0.015;

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Parallax layer - Faint space backdrop stars (highly slow translation) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ transform: `translateY(${starsOffsetY}px)` }}
      >
        <canvas ref={canvasRef} className="w-full h-full block opacity-85" />
      </div>

      {/* Decorative backdrop gradients (blurred glowing nodes) */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-pink-600/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute -bottom-10 left-[40%] w-[400px] h-[400px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse" />

      {/* Main Container - styled with high density dashboard modules */}
      <div 
        className="relative max-w-7xl mx-auto px-6 w-full z-10 flex flex-col lg:flex-row items-center gap-12"
        style={{ transform: `translateY(${contentOffsetY}px)` }}
      >
        {/* Left Column: Elegant display typography */}
        <div className="flex-1 text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-cyan-950/40 border border-purple-500/35 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-[9px] tracking-[0.12em] bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent uppercase font-black">
              System Live &amp; Open for Contributions
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-5xl sm:text-6xl xl:text-7.5xl font-light tracking-tight text-white leading-[1.1]">
              Full-Stack <br />
              <span className="italic font-bold bg-gradient-to-r from-cyan-400 via-purple-500 via-pink-500 to-amber-400 bg-clip-text text-transparent">Software</span> <br />
              Engineer
            </h1>
            <p className="font-sans text-sm text-neutral-400 max-w-lg font-light leading-relaxed">
              Focused on building high-performance web applications and automated pipeline engines where functional clean architecture meets seamless modular layout design.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#projects"
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.3)] rounded-md"
            >
              Explore Projects
            </a>
            
            <a
              href="#contact"
              className="px-8 py-3.5 border border-cyan-500/30 text-xs font-bold uppercase tracking-widest text-cyan-300 hover:border-cyan-400 hover:text-white transition-all hover:bg-cyan-950/20 active:scale-95 shadow-[0_0_15px_rgba(56,189,248,0.15)] rounded-md"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right Column: Sleek minimal typography card */}
        <div className="flex-1 flex justify-center w-full lg:w-auto h-full">
          <div
            className="relative w-full max-w-sm rounded bg-[#121212]/90 p-8 shadow-2xl transition-all duration-300 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative group overflow-hidden"
            style={{
              transform: `perspective(1000px) rotateX(${glintRotateX}deg) rotateY(${glintRotateY}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Colorful card edge aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute -inset-[1px] bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-400 rounded z-[-1] opacity-25 group-hover:opacity-60 transition-opacity duration-350" />

            {/* Minimalist corner indicators */}
            <div className="absolute top-6 left-6 text-[8px] font-mono text-neutral-600 tracking-widest">
              L_REF // 01
            </div>
            <div className="absolute bottom-6 right-6 text-[8px] font-mono text-neutral-600 tracking-widest">
              FA_2026
            </div>

            {/* Glowing icon frame */}
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-950 via-purple-950 to-pink-950 border border-purple-500/30 flex items-center justify-center text-cyan-400 mb-8 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <svg className="w-10 h-10 text-cyan-400 animate-float" viewBox="0 0 100 100">
                <polygon points="50,15 80,35 80,65 50,85 20,65 20,35" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />
              </svg>
            </div>

            {/* Header Identity */}
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-display text-2xl font-light text-white tracking-wide">
                  Farouk Ayomide
                </h3>
                <p className="font-mono text-[9px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-[0.15em] uppercase font-extrabold">
                  Full-Stack Software Engineer
                </p>
              </div>

              <p className="font-sans text-xs text-neutral-400 text-center leading-relaxed font-light">
                Creating clean, high-performance web applications and automated systems using TypeScript, React, and Node.js.
              </p>
            </div>

            <div className="mt-8 border-t border-white/5 pt-6 space-y-3 font-mono text-[10px]">
              <div className="flex justify-between items-center text-neutral-500">
                <span className="uppercase tracking-wider">Focus</span>
                <span className="text-[#e5e5e5] font-light bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold">Full-Stack Systems</span>
              </div>
              <div className="flex justify-between items-center text-neutral-500">
                <span className="uppercase tracking-wider">Location</span>
                <span className="text-[#e5e5e5] font-light">Nigeria</span>
              </div>
              <div className="flex justify-between items-center text-neutral-500">
                <span className="uppercase tracking-wider">LinkedIn</span>
                <a href="https://www.linkedin.com/in/farouk-ayomide-aa73b538a" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline">farouk-ayomide</a>
              </div>
              <div className="flex justify-between items-start text-neutral-500">
                <span className="uppercase tracking-wider mt-0.5">Github</span>
                <div className="flex flex-col items-end gap-1 font-bold">
                  <a href="https://github.com/frukose" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 hover:underline">@frukose</a>
                  <a href="https://github.com/farouk908" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline">@farouk908</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bounce scroll down button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
        <span className="font-mono text-[8px] tracking-widest text-[#8e8e8e] uppercase">
          SCROLL TO ORCHESTRATE
        </span>
        <motion.a
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          href="#projects"
          className="w-5 h-8 rounded-full border border-cyan-500/25 flex items-start justify-center p-1 cursor-pointer focus:outline-none shadow-[0_0_10px_rgba(56,189,248,0.15)]"
        >
          <motion.div className="w-1 h-2 rounded-full bg-gradient-to-b from-cyan-400 to-purple-500" />
        </motion.a>
      </div>
    </section>
  );
};
