"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import type { Agent, Workflow, WorkflowStep } from "@/types/agent";
import { agents, exampleGoals } from "@/lib/data";
import { cn } from "@/lib/utils";

interface OrchestrateProps {
  hiredAgentIds: string[];
  onHire: (agent: Agent) => void;
}

type GenStatus = "idle" | "generating" | "ready" | "executing";

export default function Orchestrate({ hiredAgentIds }: OrchestrateProps) {
  const [goal, setGoal] = useState("");
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [status, setStatus] = useState<GenStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const generateWorkflow = async () => {
    if (!goal.trim() || status === "generating") return;
    setStatus("generating");
    setError(null);
    setWorkflow(null);

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.workflow) throw new Error("No workflow returned");
      setWorkflow(data.workflow);
      setStatus("ready");
    } catch (err: any) {
      setError(err.message || "Failed to generate workflow");
      setStatus("idle");
    }
  };

  const executeWorkflow = async () => {
    if (!workflow) return;
    setStatus("executing");

    // Sequentially flip each pending/running step to completed with simulated output
    const steps = [...workflow.steps];
    for (let i = 0; i < steps.length; i++) {
      steps[i] = { ...steps[i], status: "running" };
      setWorkflow({ ...workflow, steps: [...steps] });
      await new Promise((r) => setTimeout(r, 1200));
      steps[i] = {
        ...steps[i],
        status: "completed",
        output: steps[i].output || `Step ${i + 1} complete — output captured.`,
        durationMs: 1000 + Math.floor(Math.random() * 4000),
      };
      setWorkflow({ ...workflow, steps: [...steps] });
    }
    setStatus("idle");
  };

  const reset = () => {
    setWorkflow(null);
    setGoal("");
    setStatus("idle");
    setError(null);
  };

  const getStatusIcon = (s: WorkflowStep["status"]) => {
    switch (s) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />;
      case "failed":
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground/50" />;
    }
  };

  const getStatusColor = (s: WorkflowStep["status"]) => {
    switch (s) {
      case "completed":
        return "bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-900/40";
      case "running":
        return "bg-amber-50/50 border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40";
      case "failed":
        return "bg-red-50/50 border-red-200/60 dark:bg-red-950/20 dark:border-red-900/40";
      default:
        return "bg-muted/30 border-border";
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Orchestrate Workflow
        </h2>
        <p className="text-sm text-muted-foreground">
          Describe your goal — AI assembles the perfect agent team and runs it end-to-end.
        </p>
      </div>

      {/* Goal Input */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <label className="block text-sm font-semibold mb-3">
          What do you want to achieve?
        </label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., 'Build a SaaS landing page with competitor analysis, copy, design, and code'"
          className="w-full min-h-[110px] p-4 rounded-xl border border-border bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {/* Example chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="text-[11px] text-muted-foreground self-center mr-1">
            Try:
          </span>
          {exampleGoals.slice(0, 3).map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left max-w-[280px] truncate"
              title={g}
            >
              {g.length > 50 ? g.slice(0, 50) + "…" : g}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>AI picks optimal agents, order, and cost</span>
          </div>
          <div className="flex items-center gap-2">
            {workflow && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors text-muted-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
            <button
              onClick={generateWorkflow}
              disabled={!goal.trim() || status === "generating"}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all",
                !goal.trim() || status === "generating"
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:shadow-md hover:shadow-primary/20"
              )}
            >
              {status === "generating" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Assembling team…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Workflow
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-4 mb-6 text-sm text-red-700 dark:text-red-400">
          <strong>Could not generate workflow.</strong> {error}
        </div>
      )}

      {/* Workflow Display */}
      <AnimatePresence mode="wait">
        {workflow && (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Steps */}
            <div className="lg:col-span-2 space-y-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Agent Workflow · {workflow.steps.length} steps
                </h3>
                <span className="text-xs text-muted-foreground">
                  Est. {Math.round(workflow.estimatedDurationMs / 1000)}s · ${workflow.totalCost.toFixed(2)}
                </span>
              </div>

              {workflow.steps.map((step, i) => (
                <div key={step.id} className="workflow-connector relative">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border mb-3",
                      getStatusColor(step.status)
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                        step.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : step.status === "running"
                          ? "bg-amber-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        step.order
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg">{step.agentIcon}</span>
                          <span className="font-semibold text-sm truncate">
                            {step.agentName}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-xs text-muted-foreground truncate">
                            {step.description.length > 60
                              ? step.description.slice(0, 60) + "…"
                              : step.description}
                          </span>
                        </div>
                        {getStatusIcon(step.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {step.description}
                      </p>

                      {step.output && (
                        <div className="text-xs bg-background/60 rounded-lg p-2.5 mt-2 border border-border/50">
                          <span className="font-medium text-muted-foreground">
                            Output:{" "}
                          </span>
                          <span className="text-foreground">{step.output}</span>
                        </div>
                      )}

                      {step.status === "running" && (
                        <div className="mt-2.5">
                          <div className="h-1.5 bg-background rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "70%" }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Cost breakdown */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Cost Breakdown
                </h4>
                <div className="space-y-2.5">
                  {workflow.steps.map((s) => (
                    <div key={s.id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5 min-w-0">
                        <span>{s.agentIcon}</span>
                        <span className="truncate">{s.agentName}</span>
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          s.cost > 0 ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        ${s.cost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2.5 flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span className="gradient-text">
                      ${workflow.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                  vs. <span className="font-semibold text-foreground">$2,500+</span>{" "}
                  for a human team · <span className="font-semibold text-emerald-500">99% savings</span>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="font-semibold text-sm mb-3">Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={executeWorkflow}
                    disabled={status === "executing"}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
                      status === "executing"
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:shadow-md hover:shadow-primary/20"
                    )}
                  >
                    {status === "executing" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Executing…
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Execute Workflow
                      </>
                    )}
                  </button>
                  <button
                    onClick={reset}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Discard & start over
                  </button>
                </div>
              </div>

              {/* Pro tip */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <div className="text-xs font-semibold mb-0.5">Pro tip</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Be specific about deliverables ("ship a Next.js page",
                      "write 5 ad variants") — agents produce tighter output.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
