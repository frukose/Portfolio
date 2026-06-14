/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Music,
  Cpu,
  Terminal,
  Atom,
  Code,
  Blocks,
  Sparkles,
  Layers,
  Palette,
  Cloud,
  ArrowUpRight,
  Github,
  ExternalLink,
  ChevronRight,
  Send,
  MapPin,
  Calendar,
  Flame,
  Sliders,
  Mail,
  Linkedin,
  X,
  Play,
  RotateCcw,
  Zap,
  Check,
  CheckCircle2
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Music,
  Cpu,
  Terminal,
  Atom,
  Code,
  Blocks,
  Sparkles,
  Layers,
  Palette,
  Cloud,
  ArrowUpRight,
  Github,
  ExternalLink,
  ChevronRight,
  Send,
  MapPin,
  Calendar,
  Flame,
  Sliders,
  Mail,
  Linkedin,
  X,
  Play,
  RotateCcw,
  Zap,
  Check,
  CheckCircle2
};

interface LucideIconProps {
  name: string;
  className?: string;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name] || Code;
  return <IconComponent className={className} />;
};
