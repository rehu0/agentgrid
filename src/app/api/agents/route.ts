import { NextResponse } from "next/server";
import { agents, agentCategories, platformStats } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    agents,
    categories: agentCategories,
    platformStats,
    total: agents.length,
  });
}
