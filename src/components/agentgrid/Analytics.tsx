"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { agents, defaultUserStats } from "@/lib/data";

const taskVolumeData = [
  { day: "Mon", tasks: 28, cost: 12 },
  { day: "Tue", tasks: 35, cost: 15 },
  { day: "Wed", tasks: 42, cost: 18 },
  { day: "Thu", tasks: 38, cost: 16 },
  { day: "Fri", tasks: 51, cost: 22 },
  { day: "Sat", tasks: 23, cost: 10 },
  { day: "Sun", tasks: 19, cost: 8 },
];

const categorySplit = [
  { name: "Coding", value: 32, color: "oklch(0.7 0.18 162)" },
  { name: "Research", value: 24, color: "oklch(0.7 0.22 290)" },
  { name: "Writing", value: 18, color: "oklch(0.7 0.18 0)" },
  { name: "Design", value: 14, color: "oklch(0.7 0.15 80)" },
  { name: "Other", value: 12, color: "oklch(0.7 0.15 200)" },
];

const topAgents = [...agents]
  .sort((a, b) => b.hires - a.hires)
  .slice(0, 5)
  .map((a) => ({
    name: a.name,
    icon: a.icon,
    hires: a.hires,
    rating: a.rating,
    cost: a.pricePerTask,
  }));

export default function Analytics() {
  const stats = defaultUserStats;
  const totalTasks = stats.hiredAgents.reduce(
    (sum, h) => sum + h.tasksCompleted,
    0
  );
  const totalSpend = stats.hiredAgents.reduce(
    (sum, h) => sum + h.totalSpent,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Track your agent performance, spend, and efficiency.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total tasks",
            value: totalTasks.toString(),
            change: "+18%",
            icon: Activity,
            trend: "up",
          },
          {
            label: "Total spend",
            value: `$${totalSpend.toFixed(2)}`,
            change: "+8%",
            icon: DollarSign,
            trend: "up",
          },
          {
            label: "Avg task time",
            value: "28s",
            change: "-12%",
            icon: Clock,
            trend: "down",
          },
          {
            label: "Success rate",
            value: "94.7%",
            change: "+2.1%",
            icon: TrendingUp,
            trend: "up",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <kpi.icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{kpi.value}</div>
            <div
              className={`text-[11px] inline-flex items-center gap-1 ${
                kpi.trend === "up" ? "text-emerald-500" : "text-amber-500"
              }`}
            >
              <ArrowUpRight
                className={`h-3 w-3 ${kpi.trend === "down" ? "rotate-90" : ""}`}
              />
              <span>{kpi.change}</span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Task volume */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Task volume & cost</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Tasks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Cost ($)</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={taskVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.22 290)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.7 0.22 290)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.18 162)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.7 0.18 162)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" />
                <XAxis
                  dataKey="day"
                  stroke="oklch(0.5 0 0 / 0.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.5 0 0 / 0.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.02 280)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "oklch(0.97 0 0)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="oklch(0.7 0.22 290)"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="oklch(0.7 0.18 162)"
                  strokeWidth={2}
                  fill="url(#g2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category split */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm mb-1">Task split by category</h3>
          <p className="text-xs text-muted-foreground mb-4">All time</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {categorySplit.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.02 280)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "oklch(0.97 0 0)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categorySplit.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: c.color }}
                />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="font-medium ml-auto">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm mb-4">Top agents on the grid</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topAgents}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0 0 / 0.1)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="oklch(0.5 0 0 / 0.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="oklch(0.5 0 0 / 0.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.02 280)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "oklch(0.97 0 0)",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} hires`, "Hires"]}
                />
                <Bar
                  dataKey="hires"
                  fill="oklch(0.7 0.22 290)"
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent leaderboard */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm mb-4">Your agent leaderboard</h3>
          <div className="space-y-2.5">
            {stats.hiredAgents.map((h, i) => {
              const agent = agents.find((a) => a.id === h.agentId);
              if (!agent) return null;
              return (
                <motion.div
                  key={h.agentId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <div className="text-xs font-bold text-muted-foreground w-4">
                    #{i + 1}
                  </div>
                  <div className="text-lg">{agent.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {h.tasksCompleted} tasks · ${h.totalSpent.toFixed(2)} spent
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-500">
                      {agent.successRate}%
                    </div>
                    <div className="text-[10px] text-muted-foreground">success</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
