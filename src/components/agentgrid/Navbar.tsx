"use client";

import { motion } from "framer-motion";
import { Bot, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hiredCount: number;
}

const tabs = [
  { id: "marketplace", label: "Marketplace", icon: "🛒" },
  { id: "orchestrate", label: "Orchestrate", icon: "⚡" },
  { id: "my-agents", label: "My Agents", icon: "🤖" },
  { id: "analytics", label: "Analytics", icon: "📊" },
];

export default function Navbar({ activeTab, onTabChange, hiredCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight">
                AgentGrid
              </span>
              <span className="hidden text-[10px] text-muted-foreground sm:block">
                AI Agent Marketplace
              </span>
            </div>
          </div>

          {/* Tabs */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card/50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-600"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-xs">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
                {tab.id === "my-agents" && hiredCount > 0 && (
                  <span className="relative z-10 ml-1 rounded-full bg-background/30 px-1.5 text-[10px] font-bold text-foreground">
                    {hiredCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
              onClick={() =>
                window.open(
                  "https://github.com",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <Github className="h-4 w-4" />
              <span className="ml-1.5">Star</span>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" />
              <span className="ml-1.5 hidden sm:inline">Get Started</span>
              <span className="ml-1.5 sm:hidden">Start</span>
            </Button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === "my-agents" && hiredCount > 0 && (
                <span className="ml-0.5 rounded-full bg-background/30 px-1 text-[10px] font-bold">
                  {hiredCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
