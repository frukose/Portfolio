/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "Creative" | "Platform" | "Core Engineering" | "AI & Tools";
  shortDescription: string;
  detailedDescription: string;
  challenges: string;
  solutions: string;
  tags: string[];
  gradient: string;
  iconName: string;
  metrics: ProjectMetric[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  category: "Languages" | "Libraries & Frameworks" | "Creative Technology" | "Tools & Cloud";
  iconName: string;
  proficiency: number;
  description: string;
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  bullets: string[];
  tags: string[];
}
