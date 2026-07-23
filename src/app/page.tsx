"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@/types/agent";
import Navbar from "@/components/agentgrid/Navbar";
import HeroSection from "@/components/agentgrid/HeroSection";
import Marketplace from "@/components/agentgrid/Marketplace";
import Orchestrate from "@/components/agentgrid/Orchestrate";
import MyAgents from "@/components/agentgrid/MyAgents";
import Analytics from "@/components/agentgrid/Analytics";
import Footer from "@/components/agentgrid/Footer";

type Tab = "marketplace" | "orchestrate" | "my-agents" | "analytics";

const STORAGE_KEY = "agentgrid:hiredAgents";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("marketplace");
  const [hiredAgentIds, setHiredAgentIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const ids = JSON.parse(stored) as string[];
      return Array.isArray(ids) ? ids : [];
    } catch {
      return [];
    }
  });
  const { toast } = useToast();

  // Persist hired agents whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hiredAgentIds));
    } catch {
      // ignore
    }
  }, [hiredAgentIds]);

  const handleHire = useCallback(
    (agent: Agent) => {
      setHiredAgentIds((prev) => {
        if (prev.includes(agent.id)) return prev;
        toast({
          title: `${agent.name} hired`,
          description: `${agent.icon} Ready to assign tasks. Check "My Agents" to chat.`,
        });
        return [...prev, agent.id];
      });
    },
    [toast]
  );

  const goToOrchestrate = useCallback(() => setActiveTab("orchestrate"), []);
  const goToMarketplace = useCallback(() => setActiveTab("marketplace"), []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t as Tab)}
        hiredCount={hiredAgentIds.length}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === "marketplace" && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HeroSection
                onOrchestrate={goToOrchestrate}
                onExplore={() => {
                  const el = document.getElementById("marketplace-list");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              />
              <div id="marketplace-list">
                <Marketplace
                  hiredAgentIds={hiredAgentIds}
                  onHire={handleHire}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "orchestrate" && (
            <motion.div
              key="orchestrate"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Orchestrate
                hiredAgentIds={hiredAgentIds}
                onHire={handleHire}
              />
            </motion.div>
          )}

          {activeTab === "my-agents" && (
            <motion.div
              key="my-agents"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MyAgents hiredAgentIds={hiredAgentIds} />
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Analytics />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
