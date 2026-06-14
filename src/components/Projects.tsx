/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon } from "./LucideIcon";
import { Project } from "../types";

export const Projects: React.FC = () => {
  const [repos, setRepos] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProfile, setActiveProfile] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const profiles = ["All", "frukose", "farouk908"];
  const categories = ["All", "Core Engineering", "Platform", "Creative", "AI & Tools"];

  // Fetch GitHub repos dynamically
  useEffect(() => {
    let active = true;

    const fetchAllRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchProfileRepos = async (username: string) => {
          const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
          if (!response.ok) {
            if (response.status === 403) {
              throw new Error("GitHub API rate limit exceeded. Please try again shortly.");
            }
            throw new Error(`Failed to load repositories for ${username}`);
          }
          return await response.json();
        };

        // Fetch concurrently for both profiles
        const [frukoseData, faroukData] = await Promise.all([
          fetchProfileRepos("frukose").catch(() => []),
          fetchProfileRepos("farouk908").catch(() => [])
        ]);

        if (!active) return;

        // Process data
        const processedList: Project[] = [];

        const mapRepoToProject = (repo: any, ownerName: string): Project => {
          const lang = repo.language || "Unknown";
          
          // Map category strictly based on programming language
          let category: "Creative" | "Platform" | "Core Engineering" | "AI & Tools" = "Platform";
          if (["Python", "Go", "Rust", "C++", "Java", "C", "Shell", "Docker"].includes(lang)) {
            category = "Core Engineering";
          } else if (["CSS", "HTML", "SCSS", "Sass"].includes(lang)) {
            category = "Creative";
          } else if (repo.name.toLowerCase().includes("ai") || repo.name.toLowerCase().includes("bot") || repo.name.toLowerCase().includes("tool")) {
            category = "AI & Tools";
          } else if (["TypeScript", "JavaScript", "Vue", "React"].includes(lang)) {
            category = "Platform";
          }

          // Map iconName strictly based on language
          let iconName = "Code";
          if (["CSS", "HTML", "SCSS"].includes(lang)) {
            iconName = "Palette";
          } else if (["Python", "Go", "Rust"].includes(lang)) {
            iconName = "Cpu";
          } else if (repo.name.toLowerCase().includes("database") || repo.name.toLowerCase().includes("sql")) {
            iconName = "Layers";
          } else if (repo.name.toLowerCase().includes("bot") || repo.name.toLowerCase().includes("automate")) {
            iconName = "Terminal";
          }

          // Choose a design gradient based on the length of the repo name to keep it aesthetic yet structured
          const gradients = [
            "from-purple-600 via-indigo-600 to-blue-700",
            "from-amber-500 via-orange-600 to-red-700",
            "from-emerald-500 via-teal-600 to-cyan-700",
            "from-cyan-500 via-blue-600 to-indigo-700",
            "from-rose-500 via-pink-600 to-red-700"
          ];
          const gradientIndex = (repo.name.length + repo.stargazers_count) % gradients.length;
          const gradient = gradients[gradientIndex];

          // Reformat repo name into a readable title (e.g. "my-project-name" -> "My Project Name")
          const title = repo.name
            .split(/[-_]+/)
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          const topics = repo.topics || [];
          const tags = [repo.language, ...topics].filter(Boolean);
          if (tags.length === 0) tags.push("Repository", "Open Source");

          return {
            id: repo.id.toString(),
            title,
            subtitle: repo.description ? repo.description.slice(0, 50) + "..." : `@${ownerName} Codebase`,
            category,
            shortDescription: repo.description || "A public repository demonstrating structured deployment frameworks, codebase organization, and engineering patterns.",
            detailedDescription: repo.description || `A workspace directory showcasing collaborative open-source packages and dependencies controlled under @${ownerName}.`,
            challenges: "Maintaining structured module separation borders and robust testing loops.",
            solutions: "Using strict lint checks, functional state management, and declarative React containers.",
            tags: tags.slice(0, 4),
            gradient,
            iconName,
            metrics: [
              { label: "Stars", value: repo.stargazers_count.toString() },
              { label: "Forks", value: repo.forks_count.toString() },
              { label: "Size", value: `${(repo.size / 1024).toFixed(1)} MB` }
            ],
            githubUrl: repo.html_url,
            liveUrl: repo.homepage || repo.html_url,
            featured: !repo.fork
          };
        };

        // Compile and format repositories
        frukoseData.forEach((repo: any) => {
          processedList.push(mapRepoToProject(repo, "frukose"));
        });
        faroukData.forEach((repo: any) => {
          // Verify duplicate repo ids before pushing
          if (!processedList.some(r => r.id === repo.id.toString())) {
            processedList.push(mapRepoToProject(repo, "farouk908"));
          }
        });

        // Sort: Original (non-forks) first, then by popularity (stars)
        processedList.sort((a, b) => b.featured ? 1 : -1);

        setRepos(processedList);
      } catch (err: any) {
        if (active) {
          setError(err.message || "An issue occurred while fetching your active projects.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAllRepos();
    return () => {
      active = false;
    };
  }, []);

  // Compute stats on the fly based on loaded repos
  const stats = React.useMemo(() => {
    if (repos.length === 0) return { total: 0, stars: 0, forks: 0, topLang: "TypeScript" };
    
    let starsCount = 0;
    let forksCount = 0;
    const languages: Record<string, number> = {};

    repos.forEach(r => {
      const starMetric = r.metrics.find(m => m.label === "Stars")?.value || "0";
      const forkMetric = r.metrics.find(m => m.label === "Forks")?.value || "0";
      starsCount += parseInt(starMetric, 10) || 0;
      forksCount += parseInt(forkMetric, 10) || 0;

      const mainLanguage = r.tags[0];
      if (mainLanguage && mainLanguage !== "Repository" && mainLanguage !== "Open Source") {
        languages[mainLanguage] = (languages[mainLanguage] || 0) + 1;
      }
    });

    let topLang = "TypeScript";
    let maxCount = 0;
    Object.entries(languages).forEach(([lang, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        topLang = lang;
      }
    });

    return {
      total: repos.length,
      stars: starsCount,
      forks: forksCount,
      topLang
    };
  }, [repos]);

  // Handle local state filtering
  const filteredProjects = repos.filter(project => {
    // Category filter
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    
    // Developer profile filter
    const matchesProfile = activeProfile === "All" || 
      (activeProfile === "frukose" && project.githubUrl?.includes("github.com/frukose")) ||
      (activeProfile === "farouk908" && project.githubUrl?.includes("github.com/farouk908"));

    // Query Search
    const matchesSearch = searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.shortDescription && project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesProfile && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 bg-[#0a0a0a] relative">
      {/* Visual background ambient glow node */}
      <div className="absolute top-[15%] right-[12%] w-[450px] h-[450px] bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[8%] w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-[130px] pointer-events-none" />

      {/* Title block */}
      <div className="space-y-4 mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-neutral-900 to-cyan-950/40 border border-cyan-500/30 rounded-full font-mono text-[9px] uppercase tracking-widest text-cyan-300 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Verified Codework
          </div>
          <h2 className="font-display text-4xl font-black tracking-tight text-white leading-none">
            GitHub <span className="italic font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Repositories</span>
          </h2>
          <p className="font-sans text-xs text-neutral-400 mt-2 font-light max-w-lg leading-relaxed">
            Real-time project components and live architectures synchronized directly from Farouk's personal accounts.
          </p>
        </div>

        {/* Filter controls container */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
          {/* Profile Switcher */}
          <div className="flex bg-[#121212] border border-white/5 rounded p-0.5 w-full sm:w-auto">
            {profiles.map((prof) => (
              <button
                key={prof}
                onClick={() => setActiveProfile(prof)}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 font-mono text-[8.5px] uppercase font-bold tracking-wider rounded transition-all cursor-pointer ${
                  activeProfile === prof ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]" : "text-neutral-500 hover:text-white border border-transparent"
                }`}
              >
                {prof === "All" ? "Both Profiles" : `@${prof}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* live metric blocks bar */}
      {!loading && !error && repos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 font-mono text-[10px]">
          <div className="bg-neutral-950 border border-cyan-500/20 p-4 rounded text-center md:text-left shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <span className="text-neutral-500 uppercase tracking-widest block text-[8px] mb-2">Total Codebases</span>
            <span className="text-cyan-400 text-xl font-bold block">{stats.total}</span>
          </div>
          <div className="bg-neutral-950 border border-pink-500/20 p-4 rounded text-center md:text-left shadow-[0_0_15px_rgba(236,72,153,0.05)]">
            <span className="text-neutral-500 uppercase tracking-widest block text-[8px] mb-2">Total Repository Stars</span>
            <span className="text-pink-400 text-xl font-bold block flex items-center justify-center md:justify-start gap-1">
              {stats.stars} <LucideIcon name="Sparkles" className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            </span>
          </div>
          <div className="bg-neutral-950 border border-purple-500/20 p-4 rounded text-center md:text-left shadow-[0_0_15px_rgba(168,85,247,0.05)]">
            <span className="text-neutral-500 uppercase tracking-widest block text-[8px] mb-2">Project Forks</span>
            <span className="text-purple-400 text-xl font-bold block">{stats.forks}</span>
          </div>
          <div className="bg-neutral-950 border border-amber-500/20 p-4 rounded text-center md:text-left shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <span className="text-neutral-500 uppercase tracking-widest block text-[8px] mb-2">Dominant Language</span>
            <span className="text-amber-400 text-xl font-bold block uppercase tracking-wider">{stats.topLang}</span>
          </div>
        </div>
      )}

      {/* Search Input and Categories block */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 border-b border-white/5 pb-6">
        {/* Search Inputs */}
        <div className="relative w-full md:max-w-xs font-mono text-[10px]">
          <input
            type="text"
            className="w-full bg-[#121212] border border-white/5 rounded py-2 px-3.5 pl-8 text-white focus:outline-none focus:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all"
            placeholder="Search projects by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            <LucideIcon name="Terminal" className="w-3.5 h-3.5" />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-1 w-full md:w-auto justify-start md:justify-end">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 py-1.5 font-mono text-[8.5px] uppercase font-bold tracking-[0.1em] rounded-full transition-all duration-300 cursor-pointer ${
                  isSelected ? "text-cyan-300 bg-cyan-900/20 border border-cyan-500/35 shadow-[0_0_10px_rgba(6,182,212,0.15)]" : "text-neutral-500 hover:text-white border border-transparent"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading and skeleton layout block */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-[#121212] border border-white/5 p-8 rounded min-h-[300px] animate-pulse relative">
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 rounded bg-neutral-900" />
                <div className="w-20 h-3 rounded bg-neutral-900" />
              </div>
              <div className="space-y-3 mb-8">
                <div className="w-2/3 h-6 rounded bg-neutral-900" />
                <div className="w-1/3 h-3 rounded bg-neutral-900" />
                <div className="w-full h-12 rounded bg-neutral-900" />
              </div>
              <div className="flex gap-2.5">
                <div className="w-14 h-4 bg-neutral-900 rounded" />
                <div className="w-14 h-4 bg-neutral-900 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fallback & Error presentation */}
      {error && (
        <div className="bg-[#121212] border border-[#c5a059]/10 rounded p-12 text-center max-w-xl mx-auto space-y-4">
          <LucideIcon name="Cloud" className="w-12 h-12 mx-auto text-[#c5a059] animate-bounce" />
          <h4 className="font-display text-xl font-light text-white uppercase tracking-wider">Connection Isolated</h4>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed font-light">
            We encountered a rate-limit constraint from GitHub's server blocks while retrieving repositories. You may directly visit the live profiles below:
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4 text-[10px] font-mono">
            <a
              href="https://github.com/frukose"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-white/5 rounded hover:border-[#c5a059] text-neutral-300 hover:text-[#c5a059] transition-all"
            >
              @frukose Profile
            </a>
            <a
              href="https://github.com/farouk908"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-white/5 rounded hover:border-[#c5a059] text-neutral-300 hover:text-[#c5a059] transition-all"
            >
              @farouk908 Profile
            </a>
          </div>
        </div>
      )}

      {/* Loaded Projects Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="projects-vault">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-16 text-center border border-dashed border-white/5 bg-neutral-950/40 rounded">
                <LucideIcon name="Terminal" className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">No matching repositories found</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#121212]/95 border border-transparent rounded p-6 md:p-8 flex flex-col justify-between h-full transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.05)] relative group overflow-hidden"
                >
                  {/* Glowing custom gradient backdrop halo on hover */}
                  <div className={`absolute -inset-[1px] bg-gradient-to-r ${project.gradient} rounded z-[-1] opacity-20 group-hover:opacity-75 transition-opacity duration-350`} />
                  <div className="absolute inset-[1px] bg-[#121212] rounded z-[-1]" />

                  {/* Subtle color highlight in card corner stretched */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${project.gradient} opacity-90 group-hover:h-2 transition-all duration-300`} />

                  <div className="space-y-6">
                    {/* Meta Row */}
                    <div className="flex justify-between items-center z-10 relative">
                      <div className="p-2.5 rounded bg-neutral-900 border border-white/5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300">
                        <LucideIcon name={project.iconName} className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest bg-neutral-950 px-2 py-1 rounded border border-white/5">
                        {project.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 z-10 relative">
                      <h3 className="font-display text-xl font-bold text-white tracking-wide group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 flex items-center justify-between">
                        {project.title}
                        {project.liveUrl !== project.githubUrl && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" title="Production live project" />
                        )}
                      </h3>
                      <p className="font-sans text-xs text-neutral-450 leading-relaxed font-light">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Technical metrics */}
                    <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-2 font-mono text-[8.5px] z-10 relative">
                      {project.metrics.map((metric, idx) => (
                        <div key={idx} className="bg-neutral-900/60 p-2 border border-white/5 rounded group-hover:border-purple-500/20 transition-all duration-300">
                          <span className="text-neutral-510 block uppercase tracking-wider">{metric.label}</span>
                          <span className="text-white block font-bold mt-1">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action row with tags & links */}
                  <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-white/5 z-10 relative">
                    <div className="flex flex-wrap gap-1 max-w-[60%]">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[#161616] border border-white/5 rounded font-mono text-[7.5px] text-neutral-500 uppercase group-hover:text-cyan-300 group-hover:border-cyan-500/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3.5 font-mono text-[9px] tracking-wider font-bold">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 uppercase"
                        >
                          <LucideIcon name="Github" className="w-3.5 h-3.5" />
                          Code
                        </a>
                      )}
                      {(project.homepageUrl || project.liveUrl) && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-pink-400 transition-colors flex items-center gap-1 uppercase"
                        >
                          <LucideIcon name="ExternalLink" className="w-3.5 h-3.5" />
                          {project.liveUrl === project.githubUrl ? "GitHub" : "Live"}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};
