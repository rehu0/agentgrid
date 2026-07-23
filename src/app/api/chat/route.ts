import { NextResponse } from "next/server";
import { agents } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequest {
  agentId: string;
  agentName: string;
  agentRole: string;
  message: string;
}

async function aiReply(
  agentName: string,
  agentRole: string,
  message: string
): Promise<string | null> {
  try {
    const ZAIModule = await import("z-ai-web-dev-sdk");
    const ZAI = ZAIModule.default;
    const zai = await ZAI.create();

    const systemPrompt = `You are ${agentName}, an AI agent on the AgentGrid marketplace.

Your role: ${agentRole}

Personality:
- Confident, concise, and pragmatic
- Talk like a senior specialist who ships — not a chatbot
- Use short sentences. Skip filler.
- When the user asks for something concrete, propose a plan with 2-4 bullet steps and offer to start
- When you need more info, ask exactly one clarifying question
- Never say you're "just an AI" or "an AI model" — you ARE ${agentName}
- Keep replies under 120 words`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      thinking: { type: "disabled" },
      temperature: 0.7,
      max_tokens: 400,
    });

    return completion.choices[0]?.message?.content ?? null;
  } catch (err) {
    console.error("[chat] AI call failed:", err);
    return null;
  }
}

function fallbackReply(agentName: string, agentRole: string, message: string): string {
  const lower = message.toLowerCase();
  if (/hello|hi|hey|salam|namaste/.test(lower)) {
    return `${agentName} here. I handle ${agentRole.toLowerCase()}. What would you like me to ship today?`;
  }
  if (/price|cost|how much/.test(lower)) {
    return `My per-task rate is on my marketplace card. For multi-step jobs, the orchestrator will give you a full cost breakdown up front — no surprises.`;
  }
  if (/help|what can you|capab/.test(lower)) {
    return `I specialize in: ${agentRole}. Tell me the outcome you want and I'll propose a 2-3 step plan.`;
  }
  return `Got it. Based on "${message.slice(0, 60)}${message.length > 60 ? "…" : ""}", here's how I'd approach it:\n\n1. Quick scoping — confirm the deliverable and success criteria\n2. Draft v1 — ship something reviewable\n3. Iterate — refine based on your feedback\n\nWant me to start with step 1?`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const { agentId, agentName, agentRole, message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Validate agent
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
    }

    const reply =
      (await aiReply(agent.name, agent.description, message)) ||
      fallbackReply(agent.name, agent.description, message);

    return NextResponse.json({
      reply,
      agentId: agent.id,
      agentName: agent.name,
    });
  } catch (err: any) {
    console.error("[chat] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to chat with agent" },
      { status: 500 }
    );
  }
}
