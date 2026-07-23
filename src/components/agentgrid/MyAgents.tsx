"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, MessageSquare, Send, TrendingUp, X } from "lucide-react";
import { agents, defaultUserStats } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/agent";

interface MyAgentsProps {
  hiredAgentIds: string[];
}

export default function MyAgents({ hiredAgentIds }: MyAgentsProps) {
  const stats = defaultUserStats;
  const hiredAgents = agents.filter((a) => hiredAgentIds.includes(a.id));

  // Chat state
  const [chatAgentId, setChatAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const chatAgent = chatAgentId ? agents.find((a) => a.id === chatAgentId) : null;

  const openChat = (agentId: string) => {
    setChatAgentId(agentId);
    setMessages([]);
  };

  const closeChat = () => {
    setChatAgentId(null);
    setMessages([]);
    setInput("");
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatAgent || sending) return;
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    const currentInput = input;
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: chatAgent.id,
          agentName: chatAgent.name,
          agentRole: chatAgent.description,
          message: currentInput,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const agentMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        role: "agent",
        content: data.reply || "(no response)",
        agentName: chatAgent.name,
        agentIcon: chatAgent.icon,
        timestamp: new Date(),
      };
      setMessages((m) => [...m, agentMsg]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: `m-err-${Date.now()}`,
          role: "system",
          content: "Could not reach the agent. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">My Agents</h2>
        <p className="text-sm text-muted-foreground">
          Manage your hired AI agents, assign tasks, and chat in real time.
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Tasks this month</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.tasksThisMonth}</div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all"
              style={{ width: `${(stats.tasksThisMonth / stats.tasksLimit) * 100}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {stats.tasksLimit - stats.tasksThisMonth} remaining of {stats.tasksLimit}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Spend this month</span>
            <span className="text-emerald-500 text-sm">↓ 8%</span>
          </div>
          <div className="text-3xl font-bold mb-2">${stats.spendThisMonth.toFixed(2)}</div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all"
              style={{ width: `${(stats.spendThisMonth / stats.spendLimit) * 100}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            ${(stats.spendLimit - stats.spendThisMonth).toFixed(2)} remaining of $
            {stats.spendLimit}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Active agents</span>
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold mb-2">{hiredAgents.length}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {hiredAgents.length > 0
              ? "All agents operational"
              : "No agents hired yet — visit the marketplace"}
          </div>
        </div>
      </div>

      {/* Hired Agents */}
      {hiredAgents.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold mb-2">No agents hired yet</h3>
          <p className="text-sm text-muted-foreground">
            Head to the marketplace and hire your first AI agent.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hiredAgents.map((agent, i) => {
            const hiredInfo = stats.hiredAgents.find((h) => h.agentId === agent.id);
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-md",
                        agent.gradient
                      )}
                    >
                      {agent.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">by {agent.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="status-dot active" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => openChat(agent.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-primary-foreground text-xs font-semibold hover:shadow-md hover:shadow-primary/20 transition-all"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Chat
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                    <Send className="h-3.5 w-3.5" />
                    Assign task
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {hiredInfo?.tasksCompleted ?? 0}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Done
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {hiredInfo?.tasksAssigned ?? 0}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Assigned
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{agent.avgResponseTime}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Avg speed
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Chat Modal */}
      {chatAgent && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={closeChat}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-2xl bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh]"
          >
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg",
                    chatAgent.gradient
                  )}
                >
                  {chatAgent.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{chatAgent.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="status-dot active" />
                    {chatAgent.description.slice(0, 50)}…
                  </div>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin min-h-[300px]">
              {messages.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <div className="text-3xl mb-2">{chatAgent.icon}</div>
                  <p className="font-medium text-foreground mb-1">
                    Chat with {chatAgent.name}
                  </p>
                  <p className="text-xs">
                    Ask anything — {chatAgent.name} is ready to help.
                  </p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-2",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {m.role !== "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-sm">
                      {m.agentIcon || "🤖"}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                      m.role === "user"
                        ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-br-sm"
                        : m.role === "system"
                        ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 text-xs"
                        : "bg-muted text-foreground rounded-bl-sm"
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-2 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-sm">
                    {chatAgent.icon}
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                    <span
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={`Message ${chatAgent.name}…`}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className={cn(
                  "flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
                  !input.trim() || sending
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:shadow-md hover:shadow-primary/20"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
