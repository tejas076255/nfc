import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getDb, schema } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const { subject, message, name, email } = body as any;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const userName = session?.user?.name || name || "Customer";
    const userEmail = session?.user?.email || email || "unknown@tapbez.in";
    const workspaceId = session?.workspace?.id || null;
    const userId = session?.user?.id || null;
    const now = Math.floor(Date.now() / 1000);
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const db = await getDb();

    // 1. Insert into supportTickets table
    await db.insert(schema.supportTickets).values({
      id: ticketId,
      workspaceId,
      userId,
      userName,
      userEmail,
      subject: subject || "General Support",
      message: message.trim(),
      status: "open",
      createdAt: now,
      updatedAt: now,
    });

    // 2. Also log to auditLogs so it appears in security & operations logs
    await db.insert(schema.auditLogs).values({
      id: crypto.randomUUID(),
      workspaceId,
      actorId: userId || "guest",
      actorRole: session?.user?.role || "user",
      action: "support_ticket_submitted",
      resourceType: "support_ticket",
      resourceId: ticketId,
      metadata: JSON.stringify({
        ticketId,
        userName,
        userEmail,
        subject: subject || "General Support",
        message: message.trim(),
      }),
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Your support request has been logged and sent to the Tapbez admin team.",
    });
  } catch (error: any) {
    console.error("Support ticket submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit support ticket" },
      { status: 500 }
    );
  }
}
