/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon } from "./LucideIcon";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", category: "General", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [copiedText, setCopiedText] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const emailTo = "faroukayomide33@gmail.com";
  const emailSubject = `[Inquiry] ${formData.category} from ${formData.name}`;
  const emailBody = `Hi Farouk,

My name is ${formData.name} (${formData.email}). I wanted to reach out regarding the following ${formData.category} inquiry:

---
${formData.message}
---

Best regards,
${formData.name}`;

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setValidationError("Please fill in all the fields before sending your message.");
      return;
    }

    setIsSubmitting(true);
    // Simulate network dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(emailBody);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const resetFormState = () => {
    setFormData({ name: "", email: "", category: "General", message: "" });
    setIsSubmitted(false);
    setValidationError("");
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 bg-[#0a0a0a] relative">
      <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] bg-pink-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[10%] right-[30%] w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[130px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
        
        {/* Left column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-neutral-900 to-cyan-950/40 border border-cyan-500/35 rounded-full font-mono text-[9px] uppercase tracking-widest text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Connect
          </div>

          <h2 className="font-display text-4xl font-black tracking-tight text-white leading-none">
            Get in <span className="italic font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed font-light">
            Have a project in mind, want to collaborate, or just want to chat? Shoot me a message, and let's build something exceptional together.
          </p>

          <div className="space-y-4 pt-6 border-t border-white/5 font-mono text-[10px]">
            <div className="flex items-center gap-3 bg-[#121212]/90 border border-white/5 p-4 rounded hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 group">
              <div className="p-2.5 rounded bg-neutral-900 border border-white/5 text-cyan-400 group-hover:bg-cyan-950/40 group-hover:scale-105 transition-all">
                <LucideIcon name="Mail" className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[8px] uppercase text-neutral-500 tracking-wider">Email</span>
                <p className="font-bold text-[#e5e5e5] group-hover:text-cyan-300 mt-0.5 select-all transition-colors">faroukayomide33@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#121212]/90 border border-white/5 p-4 rounded hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.05)] transition-all duration-300 group">
              <div className="p-2.5 rounded bg-neutral-900 border border-white/5 text-purple-400 group-hover:bg-purple-950/40 group-hover:scale-105 transition-all">
                <LucideIcon name="Linkedin" className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[8px] uppercase text-neutral-500 tracking-wider">LinkedIn</span>
                <p className="font-bold text-[#e5e5e5] mt-0.5 block hover:text-purple-300 transition-all duration-300 select-all">
                  <a href="https://www.linkedin.com/in/farouk-ayomide-aa73b538a" target="_blank" rel="noopener noreferrer">linkedin.com/in/farouk-ayomide-aa73b538a</a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#121212]/90 border border-white/5 p-4 rounded hover:border-pink-500/30 hover:shadow-[0_0_15px_rgba(236,72,153,0.05)] transition-all duration-300 group">
              <div className="p-2.5 rounded bg-neutral-900 border border-white/5 text-pink-400 group-hover:bg-pink-950/40 group-hover:scale-105 transition-all">
                <LucideIcon name="Github" className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[8px] uppercase text-neutral-500 tracking-wider">GitHub</span>
                <p className="font-bold text-[#e5e5e5] mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                  <a href="https://github.com/frukose" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-all duration-300">@frukose</a>
                  <span className="text-neutral-600">/</span>
                  <a href="https://github.com/farouk908" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-all duration-300">@farouk908</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - form */}
        <div className="lg:col-span-7" id="contact-capsule">
          <div className="relative bg-[#121212]/95 border border-transparent rounded p-6 md:p-8 min-h-[460px] flex flex-col justify-center shadow-2xl overflow-hidden">
            {/* Glowing neon halo backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-70 pointer-events-none" />
            <div className="absolute -inset-[1px] bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-pink-500 rounded z-[-1] opacity-20 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-5 relative z-10"
                >
                  <div className="border-b border-white/5 pb-3.5">
                    <span className="font-mono text-[9px] bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-widest block font-black">Message Form</span>
                    <h3 className="font-display font-light text-sm text-white uppercase tracking-wide">Send a Message</h3>
                  </div>

                  {validationError && (
                    <div className="bg-rose-950/20 border border-rose-500/20 p-3 rounded font-mono text-[9.5px] text-rose-450">
                      {validationError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 font-mono text-[9px] text-neutral-500">
                      <label htmlFor="name">NAME</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className="w-full bg-neutral-900 border border-white/5 focus:border-cyan-500/40 rounded px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder-neutral-700 font-sans focus:shadow-[0_0_12px_rgba(6,182,212,0.15)] bg-neutral-950"
                      />
                    </div>

                    <div className="space-y-1.5 font-mono text-[9px] text-neutral-500">
                      <label htmlFor="email">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                        className="w-full bg-neutral-900 border border-white/5 focus:border-cyan-500/40 rounded px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder-neutral-700 font-sans focus:shadow-[0_0_12px_rgba(6,182,212,0.15)] bg-neutral-950"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-[9px] text-neutral-500">
                    <label htmlFor="category">INQUIRY CATEGORY</label>
                    <select
                      name="category"
                      id="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#121212] border border-white/5 focus:border-purple-500/40 rounded px-4 py-3 text-xs text-white focus:outline-none transition-all cursor-pointer font-sans focus:shadow-[0_0_12px_rgba(168,85,247,0.15)] bg-neutral-950"
                    >
                      <option value="General">General Inquiry</option>
                      <option value="Project">New Project Proposal</option>
                      <option value="Collaboration">Collaboration Offer</option>
                      <option value="Freelance">Freelance Contracting</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 font-mono text-[9px] text-neutral-500">
                    <label htmlFor="message">MESSAGE</label>
                    <textarea
                      name="message"
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message here..."
                      className="w-full bg-neutral-900 border border-white/5 focus:border-pink-500/40 rounded px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder-neutral-700 font-sans leading-relaxed resize-none focus:shadow-[0_0_12px_rgba(236,72,153,0.15)] bg-neutral-950"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-90 text-white font-mono text-xs font-bold py-3.5 rounded transition-all active:scale-95 disabled:opacity-40 cursor-pointer uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02]"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 py-4"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-450 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-widest uppercase block font-black">
                        Transmission Formatted
                      </span>
                      <h4 className="font-display font-bold text-xl text-white tracking-tight uppercase">
                        Choose Delivery Method
                      </h4>
                      <p className="font-sans text-xs text-neutral-450 max-w-sm mx-auto leading-relaxed font-light">
                        Select one of the methods below to send the message directly to Farouk's inbox using your preferred client.
                      </p>
                    </div>
                  </div>

                  {/* Mail routing utilities */}
                  <div className="space-y-3 font-mono text-[10px] pt-4 border-t border-white/5">
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-neutral-900 hover:bg-neutral-850 border border-white/5 hover:border-cyan-500/30 p-3.5 rounded transition-all duration-300 text-[#e5e5e5] hover:text-cyan-300 shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.1)] group"
                    >
                      <div className="flex items-center gap-3">
                        <LucideIcon name="Mail" className="w-4 h-4 text-cyan-400" />
                        <span className="text-left font-bold block uppercase tracking-wide">
                          Open in Gmail Web
                          <span className="text-[8px] text-neutral-500 font-normal block tracking-normal mt-0.5 font-sans">
                            Compose on mail.google.com with prefilled text
                          </span>
                        </span>
                      </div>
                      <LucideIcon name="ExternalLink" className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400" />
                    </a>

                    <a
                      href={mailtoUrl}
                      className="flex items-center justify-between bg-neutral-900 hover:bg-neutral-850 border border-white/5 hover:border-pink-500/30 p-3.5 rounded transition-all duration-300 text-[#e5e5e5] hover:text-pink-400 shadow-sm hover:shadow-[0_0_12px_rgba(236,72,153,0.1)] group"
                    >
                      <div className="flex items-center gap-3">
                        <LucideIcon name="Smartphone" className="w-4 h-4 text-pink-400" />
                        <span className="text-left font-bold block uppercase tracking-wide">
                          Launch Default Mail App
                          <span className="text-[8px] text-neutral-500 font-normal block tracking-normal mt-0.5 font-sans">
                            Apple Mail, Outlook, or system default client
                          </span>
                        </span>
                      </div>
                      <LucideIcon name="ExternalLink" className="w-3.5 h-3.5 text-neutral-500 group-hover:text-pink-400" />
                    </a>

                    <button
                      type="button"
                      onClick={copyMessageToClipboard}
                      className="w-full flex items-center justify-between bg-neutral-900 hover:bg-neutral-850 border border-white/5 hover:border-purple-500/30 p-3.5 rounded transition-all duration-300 text-[#e5e5e5] hover:text-purple-300 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(168,85,247,0.15)] group"
                    >
                      <div className="flex items-center gap-3">
                        <LucideIcon name={copiedText ? "Check" : "Copy"} className="w-4 h-4 text-purple-400" />
                        <span className="text-left font-bold block uppercase tracking-wide">
                          {copiedText ? "Copied successfully" : "Copy Formatted Body"}
                          <span className="text-[8px] text-neutral-500 font-normal block tracking-normal mt-0.5 font-sans">
                            Save pre-formatted email structure to clipboard
                          </span>
                        </span>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-neutral-500 group-hover:text-purple-400">
                        {copiedText ? "Done" : "Copy"}
                      </span>
                    </button>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      onClick={resetFormState}
                      className="text-neutral-500 hover:text-white font-mono text-[9px] uppercase tracking-wider py-2 px-4 transition-all duration-300 flex items-center gap-1.5 active:scale-95"
                    >
                      ← Start Over / Edit Form
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
