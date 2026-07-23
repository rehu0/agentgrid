"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Agent, AgentCategory } from "@/types/agent";
import { agentCategories, agents } from "@/lib/data";
import { cn } from "@/lib/utils";
import AgentCard from "./AgentCard";

interface MarketplaceProps {
  hiredAgentIds: string[];
  onHire: (agent: Agent) => void;
}

type SortKey = "popular" | "rating" | "price-low" | "price-high" | "speed";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "price-low", label: "Price: low → high" },
  { value: "price-high", label: "Price: high → low" },
  { value: "speed", label: "Fastest" },
];

export default function Marketplace({ hiredAgentIds, onHire }: MarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState<AgentCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    let result = agents;
    if (activeCategory !== "all") {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    const sorted = [...result];
    switch (sort) {
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        sorted.sort((a, b) => a.pricePerTask - b.pricePerTask);
        break;
      case "price-high":
        sorted.sort((a, b) => b.pricePerTask - a.pricePerTask);
        break;
      case "speed":
        sorted.sort(
          (a, b) =>
            parseFloat(a.avgResponseTime) - parseFloat(b.avgResponseTime)
        );
        break;
      default:
        sorted.sort((a, b) => b.hires - a.hires);
    }
    return sorted;
  }, [activeCategory, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Agent Marketplace</h2>
        <p className="text-sm text-muted-foreground">
          {agents.length} specialized AI agents — hire instantly, pay per task
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, capability, or tag…"
            className="w-full rounded-lg border border-border bg-card pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-full sm:w-56 appearance-none rounded-lg border border-border bg-card pl-10 pr-8 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin -mx-1 px-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
            activeCategory === "all"
              ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-md shadow-primary/20"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          ✨ All
        </button>
        {agentCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              activeCategory === cat.id
                ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-md shadow-primary/20"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 rounded-2xl border border-dashed border-border"
          >
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold mb-1">No agents match your filters</h3>
            <p className="text-sm text-muted-foreground">
              Try a different category or search term.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((agent, i) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                hired={hiredAgentIds.includes(agent.id)}
                onHire={onHire}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
