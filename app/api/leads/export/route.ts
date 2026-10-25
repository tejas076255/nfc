import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getWorkspaceLeads, exportLeadsToCsv } from "@/lib/leads/service";

export async function GET(req: Request) {
  const session = await getCurrentSession();
  if (!session || !session.workspace) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";
  const profileId = searchParams.get("profileId") || "all";

  const leads = await getWorkspaceLeads(session.workspace.id, {
    status,
    profileId,
  });

  const csvContent = exportLeadsToCsv(leads);

  return new Response(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads_${session.workspace.slug}_${Date.now()}.csv"`,
    },
  });
}
