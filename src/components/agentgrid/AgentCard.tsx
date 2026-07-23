"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import type { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
  hired: boolean;
  onHire: (agent: Agent) => void;
  index?: number;
}

export default function AgentCard({ agent, hired, onHire, index = 0 }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Featured ribbon */}
      {agent.featured && (
        <div className="absolute -top-2 right-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
          ⭐ Featured
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-md",
            agent.gradient
          )}
        >
          {agent.icon}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "status-dot",
              agent.status === "active" ? "active" : agent.status === "idle" ? "idle" : "offline"
            )}
          />
          <span className="text-xs font-medium capitalize text-muted-foreground">
            {agent.status}
          </span>
        </div>
      </div>

      {/* Name + Provider */}
      <div className="mb-2">
        <h3 className="font-semibold text-base leading-tight">{agent.name}</h3>
        <p className="text-xs text-muted-foreground">by {agent.provider}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
        {agent.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {agent.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-border">
        <div>
          <div className="flex items-center gap-0.5 text-xs font-semibold">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {agent.rating}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {agent.reviews.toLocaleString()} reviews
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold">{agent.successRate}%</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">success</div>
        </div>
        <div>
          <div className="text-xs font-semibold">{agent.avgResponseTime}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">avg speed</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">${agent.pricePerTask}</span>
            <span className="text-[10px] text-muted-foreground">/task</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            {agent.hires.toLocaleString()} hires
          </div>
        </div>
        <button
          onClick={() => onHire(agent)}
          disabled={hired}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
            hired
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
              : "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:shadow-md hover:shadow-primary/20"
          )}
        >
          {hired ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Hired
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5" />
              Hire
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
