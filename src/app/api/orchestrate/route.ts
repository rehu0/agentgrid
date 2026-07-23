import { NextResponse } from "next/server";
import { agents } from "@/lib/data";
import type { Workflow, WorkflowStep } from "@/types/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface OrchestrateRequest {
  goal: string;
}

interface AIWorkflowPlan {
  steps: Array<{
    agentId: string;
    description: string;
    output?: string;
  }>;
}

// Fallback deterministic planner — used if AI is unavailable
function fallbackPlan(goal: string): AIWorkflowPlan {
  const lower = goal.toLowerCase();
  const steps: AIWorkflowPlan["steps"] = [];

  if (/(research|analy|competitor|market|brief|report|study)/.test(lower)) {
    steps.push({
      agentId: "research-pro",
      description: "Gather requirements and run multi-source research",
      output: "Briefing assembled from 20+ sources with key findings highlighted.",
    });
  }
  if (/(copy|write|blog|email|ad|content|article|script|headline)/.test(lower)) {
    steps.push({
      agentId: "copy-writer",
      description: "Draft on-brand copy matching the goal",
      output: "First draft delivered in 3 variants for A/B testing.",
    });
  }
  if (/(design|mockup|brand|ui|ux|logo|palette|figma)/.test(lower)) {
    steps.push({
      agentId: "design-studio",
      description: "Produce visual mockups in the brand palette",
      output: "Hero mockup + 3 supporting frames exported to Figma.",
    });
  }
  if (/(code|build|app|next\.?js|react|component|page|api|backend|frontend)/.test(lower)) {
    steps.push({
      agentId: "code-architect",
      description: "Implement production-ready code with tests",
      output: "Feature implemented, tests added, PR opened.",
    });
  }
  if (/(test|qa|audit|secur|performance|lighthouse|ci|deploy)/.test(lower)) {
    steps.push({
      agentId: "qa-engineer",
      description: "Run end-to-end tests, security scan, and ship to preview",
      output: "All tests green. Lighthouse 98+. Preview deployed.",
    });
  }
  if (/(market|campaign|growth|seo|social|launch|twitter|linkedin)/.test(lower)) {
    steps.push({
      agentId: "growth-marketer",
      description: "Plan and schedule the growth campaign",
      output: "7-day campaign scheduled across 3 channels with tracking.",
    });
  }
  if (/(data|analy|dashboard|ml|model|chart|graph)/.test(lower)) {
    steps.push({
      agentId: "data-scientist",
      description: "Clean data and build the analysis or dashboard",
      output: "Dashboard shipped with 4 KPIs and a Jupyter notebook.",
    });
  }

  // Ensure at least 2 steps
  if (steps.length === 0) {
    steps.push(
      {
        agentId: "research-pro",
        description: "Analyze the goal and surface requirements",
        output: "Requirements gathered and success criteria defined.",
      },
      {
        agentId: "code-architect",
        description: "Implement the deliverable based on the requirements",
        output: "Deliverable shipped with tests.",
      }
    );
  }
  if (steps.length === 1) {
    steps.push({
      agentId: "qa-engineer",
      description: "Validate the deliverable and ship to preview",
      output: "Validation complete. Ready for review.",
    });
  }
  return { steps };
}

async function aiPlan(goal: string): Promise<AIWorkflowPlan | null> {
  try {
    const ZAIModule = await import("z-ai-web-dev-sdk");
    const ZAI = ZAIModule.default;
    const zai = await ZAI.create();

    const agentCatalog = agents
      .map(
        (a) =>
          `- ${a.id} (${a.name}): ${a.description}. Capabilities: ${a.capabilities.join(", ")}.`
      )
      .join("\n");

    const systemPrompt = `You are AgentGrid's workflow orchestrator. Given a user's goal, pick 2-6 specialized agents from this catalog and sequence them into a workflow.

CATALOG:
${agentCatalog}

Respond with ONLY a JSON object of this exact shape (no markdown, no prose, no code fences):
{"steps":[{"agentId":"<id from catalog>","description":"<imperative sentence>","output":"<short past-tense outcome>"}]}

Rules:
- Use only agentIds from the catalog above.
- Order steps logically (research → write → design → code → qa).
- Each description must be a single imperative sentence under 80 chars.
- Each output must be a single past-tense sentence under 100 chars.
- Pick the minimum set of agents needed. Don't pad.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Goal: ${goal}` },
      ],
      thinking: { type: "disabled" },
      temperature: 0.4,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    // Extract JSON even if wrapped in markdown
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (!parsed.steps || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
      return null;
    }
    // Validate agentIds
    const validIds = new Set(agents.map((a) => a.id));
    const clean: AIWorkflowPlan = {
      steps: parsed.steps
        .filter((s: any) => s && validIds.has(s.agentId))
        .map((s: any) => ({
          agentId: s.agentId,
          description: String(s.description || "").slice(0, 120),
          output: s.output ? String(s.output).slice(0, 140) : undefined,
        })),
    };
    return clean.steps.length > 0 ? clean : null;
  } catch (err) {
    console.error("[orchestrate] AI planning failed:", err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrchestrateRequest;
    const goal = (body.goal || "").trim();
    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }
    if (goal.length > 1000) {
      return NextResponse.json({ error: "Goal too long" }, { status: 400 });
    }

    const plan = (await aiPlan(goal)) || fallbackPlan(goal);

    const steps: WorkflowStep[] = plan.steps.map((s, i) => {
      const agent = agents.find((a) => a.id === s.agentId)!;
      return {
        id: `s-${i + 1}`,
        order: i + 1,
        agentId: agent.id,
        agentName: agent.name,
        agentIcon: agent.icon,
        description: s.description,
        output: s.output,
        status: "pending",
        cost: agent.pricePerTask,
      };
    });

    const totalCost = steps.reduce((sum, s) => sum + s.cost, 0);
    const estimatedDurationMs = steps.length * 25000 + 5000;

    const workflow: Workflow = {
      id: `wf-${Date.now()}`,
      goal,
      steps,
      totalCost,
      estimatedDurationMs,
      createdAt: new Date(),
    };

    return NextResponse.json({ workflow });
  } catch (err: any) {
    console.error("[orchestrate] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate workflow" },
      { status: 500 }
    );
  }
}
