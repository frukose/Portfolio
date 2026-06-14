/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LucideIcon } from "./LucideIcon";

interface GithubEventGroup {
  id: string;
  dateStr: string;
  repoName: string;
  eventType: string;
  actionTitle: string;
  iconName: string;
  description: string;
  bullets: string[];
  tags: string[];
}

export const Experience: React.FC = () => {
  const [events, setEvents] = useState<GithubEventGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    const fetchEvents = async () => {
      setLoading(true);
      setError(false);
      try {
        const fetchUserEvents = async (username: string) => {
          const res = await fetch(`https://api.github.com/users/${username}/events/public?per_page=35`);
          if (!res.ok) throw new Error("API rate limit or connection issue.");
          return await res.json();
        };

        const [frukoseEvents, faroukEvents] = await Promise.all([
          fetchUserEvents("frukose").catch(() => []),
          fetchUserEvents("farouk908").catch(() => [])
        ]);

        if (!active) return;

        // Combine events
        const combined = [...frukoseEvents, ...faroukEvents];
        
        // Filter out duplicates and sort newest first
        const uniqueEvents: any[] = [];
        const seenIds = new Set<string>();
        combined.forEach(event => {
          if (!seenIds.has(event.id)) {
            seenIds.add(event.id);
            uniqueEvents.push(event);
          }
        });

        // Filter and sort by date
        uniqueEvents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Process first 10 events into readable milestone groups
        const mapped: GithubEventGroup[] = [];

        uniqueEvents.slice(0, 10).forEach((event: any) => {
          const date = new Date(event.created_at);
          const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          });
          
          let eventType = event.type;
          let actionTitle = "Developer Contribution";
          let iconName = "Code";
          let description = "Activity completed on GitHub open source projects.";
          let bullets: string[] = [];
          const tags: string[] = ["GitHub"];

          const repoName = event.repo ? event.repo.name.split("/")[1] || event.repo.name : "Codebase";

          if (eventType === "PushEvent") {
            actionTitle = "Codebase Refined (Git Push)";
            iconName = "Terminal";
            const commitCount = event.payload?.commits?.length || 1;
            description = `Pushed ${commitCount} commit${commitCount > 1 ? "s" : ""} to repository ${repoName}`;
            
            if (event.payload?.commits) {
              bullets = event.payload.commits.map((c: any) => c.message || "Updated source files");
            }
            tags.push("Push", "Development");
          } else if (eventType === "CreateEvent") {
            const refType = event.payload?.ref_type || "asset";
            actionTitle = `Workspace Core Expansion (Created ${refType})`;
            iconName = "Layers";
            description = `${refType.charAt(0).toUpperCase() + refType.slice(1)} initialization inside repository ${repoName}`;
            if (event.payload?.ref) {
              bullets.push(`Initiated branch/tag/resource: "${event.payload.ref}"`);
            }
            tags.push("Creation", "Infrastructure");
          } else if (eventType === "WatchEvent") {
            actionTitle = "Repository Highlighted & Bookmarked";
            iconName = "Sparkles";
            description = `Starred repository ${repoName} for architecture reference standard.`;
            tags.push("Stars", "Bookmarks");
          } else if (eventType === "PullRequestEvent") {
            const action = event.payload?.action || "modified";
            actionTitle = `Integration Review (Pull Request: ${action})`;
            iconName = "Blocks";
            description = `${action.charAt(0).toUpperCase() + action.slice(1)} integration branches within ${repoName}`;
            if (event.payload?.pull_request?.title) {
              bullets.push(`PR Title: "${event.payload.pull_request.title}"`);
            }
            tags.push("Collaborations", "Code Review");
          } else if (eventType === "IssuesEvent") {
            const action = event.payload?.action || "updated";
            actionTitle = `Issue Tracked (${action})`;
            iconName = "Sliders";
            description = `Handled active tasks or defect logs on repository ${repoName}`;
            if (event.payload?.issue?.title) {
              bullets.push(`Opened/updated details: "${event.payload.issue.title}"`);
            }
            tags.push("Issue Tracking", "Support");
          } else {
            // Skip other, less descriptive event types to keep timeline clean
            return;
          }

          mapped.push({
            id: event.id,
            dateStr,
            repoName,
            eventType,
            actionTitle,
            iconName,
            description,
            bullets: bullets.slice(0, 3), // Limit bullet items
            tags
          });
        });

        if (mapped.length > 0) {
          setEvents(mapped);
        } else {
          setError(true); // Treat empty events as error to load the robust fallback
        }
      } catch (err) {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="experience" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 bg-[#0a0a0a] relative">
      {/* Visual background radial glow */}
      <div className="absolute top-[20%] left-[8%] w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[125px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] bg-pink-500/[0.03] rounded-full blur-[145px] pointer-events-none" />

      {/* Title block */}
      <div className="space-y-4 mb-16 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-neutral-900 to-purple-950/40 border border-purple-500/35 rounded-full font-mono text-[9px] uppercase tracking-widest text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Verified Chronology
        </div>
        <h2 className="font-display text-4xl font-black tracking-tight text-white leading-none">
          Developer <span className="italic font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Activity Log</span>
        </h2>
        <p className="font-sans text-xs text-neutral-400 mt-2 font-light max-w-lg leading-relaxed">
          Your live engineering activity stream compiled from GitHub tracking loops, mapping pushes, branch creation, and code reviews.
        </p>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="max-w-3xl mx-auto space-y-8 animate-pulse pl-8 sm:pl-12">
          {[1, 2].map((n) => (
            <div key={n} className="bg-[#121212] border border-white/5 p-6 rounded relative">
              <div className="w-20 h-3 bg-neutral-900 rounded mb-4" />
              <div className="w-1/2 h-5 bg-neutral-900 rounded mb-2" />
              <div className="w-3/4 h-3 bg-neutral-900 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Event Log list */}
      {!loading && !error && events.length > 0 && (
        <div className="relative max-w-3xl mx-auto pl-8 sm:pl-12" id="timeline-track">
          {/* Main central path track */}
          <div className="absolute left-[3px] sm:left-[11px] top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent" />

          <div className="space-y-12">
            {events.map((evt, idx) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative group"
              >
                {/* Floating Chrono node on track */}
                <div className="absolute -left-[35px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-neutral-950 border border-cyan-400/50 flex items-center justify-center z-10 transition-colors duration-300 group-hover:border-pink-500 group-hover:bg-[#141414] shadow-lg shadow-cyan-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:bg-pink-400 animate-pulse" />
                </div>

                {/* Milestone main description card */}
                <div className="bg-[#121212]/95 border border-white/5 p-6 rounded hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.05)] transition-all duration-300 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/5 mb-4">
                    <div>
                      <span className="font-mono text-[8px] bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-widest font-black block">
                        {evt.dateStr}
                      </span>
                      <h3 className="font-display font-light text-base text-white tracking-wide mt-1 group-hover:text-cyan-300 transition-colors duration-300">
                        {evt.actionTitle}
                      </h3>
                      <p className="font-mono text-[9px] text-neutral-455 inline-flex items-center gap-1.5 mt-0.5">
                        Target repository:
                        <span className="text-cyan-300 font-bold bg-neutral-950 px-1.5 py-0.5 rounded border border-cyan-500/20">
                          {evt.repoName}
                        </span>
                      </p>
                    </div>
                    {/* Event icon indicator */}
                    <div className="p-2.5 rounded bg-neutral-900 border border-white/5 text-purple-400 group-hover:text-cyan-300 self-start sm:self-center transition-colors">
                      <LucideIcon name={evt.iconName} className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Bullet activities (commits or PR items) */}
                  {evt.bullets.length > 0 && (
                    <div className="space-y-2 pt-4">
                      {evt.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 font-sans text-xs text-neutral-350 leading-relaxed font-light">
                          <span className="mt-1 flex-shrink-0 w-4 h-4 rounded bg-[#161616] border border-white/5 flex items-center justify-center text-cyan-400 text-[9px] font-bold">
                            <LucideIcon name="Check" className="w-2.5 h-2.5" />
                          </span>
                          <p className="font-mono text-[9.5px] text-neutral-300 Pin-words italic hover:text-cyan-200">"{bullet}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5 mt-4">
                    {evt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-neutral-900 border border-white/5 rounded font-mono text-[8px] text-purple-300 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all duration-300 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback & Genuine Profile timeline */}
      {!loading && error && (
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Summary section block */}
          <div className="bg-[#121212]/95 border border-white/5 p-8 rounded space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="p-2.5 rounded bg-neutral-900 border border-white/5 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                <LucideIcon name="Layers" className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-light text-white tracking-wide">Developer Capability Profile</h3>
                <p className="font-mono text-[9px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider font-extrabold text-left">Independent Engineering Milestones</p>
              </div>
            </div>

            <p className="font-sans text-xs text-neutral-350 leading-relaxed font-light">
              Rather than list unverified client portfolios, I showcase real action capabilities over active systems. My day-to-day engineering is concentrated around modern structural design practices, pipeline automations, and asynchronous modules.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-neutral-950 p-4 rounded border border-cyan-500/10 space-y-2 hover:border-cyan-500/30 transition-all">
                <h4 className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-bold">System Design & APIs</h4>
                <p className="font-sans text-xs text-neutral-450 leading-relaxed font-light">
                  Writing modular routes with Node.js and Express, integrated with strict types. Securing endpoints and handling background job workers.
                </p>
              </div>
              <div className="bg-neutral-950 p-4 rounded border border-purple-500/10 space-y-2 hover:border-purple-500/30 transition-all">
                <h4 className="font-mono text-[10px] text-purple-400 uppercase tracking-wider font-bold">Interactive UI Architectures</h4>
                <p className="font-sans text-xs text-neutral-450 leading-relaxed font-light">
                  Directing frontend states with React, orchestrating clean responsive layouts using Tailwind, and adding rich micro-interactions.
                </p>
              </div>
            </div>

            {/* Quick Profile Links */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                Real-time activity logs available on GitHub
              </span>
              <div className="flex gap-3 text-[9px] font-mono font-bold tracking-wider uppercase">
                <a
                  href="https://github.com/frukose"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <LucideIcon name="Github" className="w-3.5 h-3.5" /> @frukose
                </a>
                <a
                  href="https://github.com/farouk908"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <LucideIcon name="Github" className="w-3.5 h-3.5" /> @farouk908
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
