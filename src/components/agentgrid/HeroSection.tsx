"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Zap } from "lucide-react";
import { platformStats } from "@/lib/data";

const iconMap = {
  Bot,
  Zap,
  DollarSign: (props: any) => <span {...props}>$</span>,
  CheckCircle: (props: any) => <span {...props}>✓</span>,
};

interface HeroSectionProps {
  onOrchestrate: () => void;
  onExplore: () => void;
}

export default function HeroSection({ onOrchestrate, onExplore }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-primary/20 blur-[120px] opacity-60" />
      <div className="absolute top-32 right-10 h-[200px] w-[200px] rounded-full bg-purple-500/20 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-4 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              The world's first multi-agent orchestration marketplace
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block">Hire AI agents.</span>
            <span className="block gradient-text">Ship in minutes.</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Don't juggle 10 tools. Describe your goal in plain English — AgentGrid
            assembles the right team of AI agents and orchestrates the entire
            workflow end-to-end.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={onOrchestrate}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Zap className="h-4 w-4" />
              Orchestrate a workflow
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-7 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              <Bot className="h-4 w-4" />
              Browse marketplace
            </button>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {platformStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-2xl border border-border bg-card/50 backdrop-blur p-4"
              >
                <div className="text-2xl sm:text-3xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
                <div
                  className={`text-[10px] mt-1 inline-flex items-center gap-1 ${
                    stat.trend === "up" ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  <span>{stat.trend === "up" ? "↑" : "↓"}</span>
                  <span>{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
