/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Skill, Experience } from "./types";

// Empty arrays to ensure no hardcoded fallback or fake projects exist.
// We will fetch your live projects directly from the GitHub REST API.
export const PROJECTS_DATA: Project[] = [];

export const SKILLS_DATA: Skill[] = [
  {
    name: "TypeScript / ESNext",
    category: "Languages",
    iconName: "Code",
    proficiency: 95,
    description: "Writing robust, scalable, and type-safe systems with structured type declarations."
  },
  {
    name: "Node.js / Express.js",
    category: "Libraries & Frameworks",
    iconName: "Cpu",
    proficiency: 93,
    description: "Developing robust back-end microservices, automated event workers, and API layers."
  },
  {
    name: "React.js / Frontend",
    category: "Libraries & Frameworks",
    iconName: "Blocks",
    proficiency: 94,
    description: "Creating highly interactive single-page user interfaces with motion layout animations."
  },
  {
    name: "Automation & Scripting",
    category: "Creative Technology",
    iconName: "Activity",
    proficiency: 92,
    description: "Building automated data scrapers, pipeline processors, and scheduling workflows."
  },
  {
    name: "Asynchronous Workflows",
    category: "Creative Technology",
    iconName: "Layers",
    proficiency: 88,
    description: "Managing backoff queuing retries, event-driven socket pipelines, and state syncing."
  },
  {
    name: "Tailwind CSS & Styling",
    category: "Tools & Cloud",
    iconName: "Palette",
    proficiency: 96,
    description: "Crafting modern layouts with balanced negative space, custom theme palettes, and grid hierarchies."
  },
  {
    name: "Git & Collaborative Flow",
    category: "Tools & Cloud",
    iconName: "Github",
    proficiency: 92,
    description: "Orchestrating code tracking, GitHub automation pipelines, branching strategies, and reviews."
  }
];

// Empty list for experience. We will pull your actual GitHub activity log as the chronological timeline.
export const EXPERIENCES_DATA: Experience[] = [];
