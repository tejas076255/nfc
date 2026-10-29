import { getDb, schema } from "../db";
import { eq, and, gte, count, sql } from "drizzle-orm";
import { fastCache } from "../cache";

export interface LogAnalyticsEventInput {
  workspaceId: string;
  profileId: string;
  eventType:
  | "profile_view"
  | "nfc_open"
  | "qr_open"
  | "save_contact_click"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "lead_submitted";
  sourceToken?: string;
  sourceType?: string;
  userAgent?: string;
  ipHash?: string;
}

export function logAnalyticsEvent(input: LogAnalyticsEventInput) {
  const executeLogging = async () => {
    // Simple bot heuristic: skip obvious bot crawlers
    const ua = (input.userAgent || "").toLowerCase();
    const isBot =
      ua.includes("bot") ||
        ua.includes("crawler") ||
        ua.includes("spider") ||
        ua.includes("googlebot") ||
        ua.includes("bingbot") ||
        ua.includes("headless")
        ? 1
        : 0;

    try {
      const db = await getDb();
      const now = Math.floor(Date.now() / 1000);

      await db.insert(schema.analyticsEvents).values({
        id: crypto.randomUUID(),
        workspaceId: input.workspaceId,
        profileId: input.profileId,
        eventType: input.eventType,
        sourceToken: input.sourceToken || null,
        sourceType: input.sourceType || "direct",
        userAgent: input.userAgent || null,
        ipHash: input.ipHash || null,
        isBot,
        timestamp: now,
      });

      // If it's a profile view, increment profile view counter
      if (input.eventType === "profile_view" && !isBot) {
        await db
          .update(schema.profiles)
          .set({
            viewsCount: sql`${schema.profiles.viewsCount} + 1`,
          })
          .where(eq(schema.profiles.id, input.profileId));
      }
    } catch (err) {
      console.error("Non-blocking analytics logging error:", err);
    }
  };

  const promise = executeLogging();

  // If in Cloudflare Worker context, register with ctx.waitUntil so response returns immediately
  try {
    import("@opennextjs/cloudflare").then(({ getCloudflareContext }) => {
      const ctx = getCloudflareContext?.();
      if (ctx?.ctx?.waitUntil) {
        ctx.ctx.waitUntil(promise);
      }
    }).catch(() => { });
  } catch { }

  return promise;
}

export async function getWorkspaceAnalyticsSummary(workspaceId: string, days = 30) {
  const cacheKey = `analytics:summary:${workspaceId}:${days}`;
  const cached = fastCache.get<any>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  const now = Math.floor(Date.now() / 1000);
  const sinceTimestamp = now - days * 24 * 60 * 60;

  const events = await db
    .select({
      eventType: schema.analyticsEvents.eventType,
      sourceType: schema.analyticsEvents.sourceType,
      timestamp: schema.analyticsEvents.timestamp,
      profileId: schema.analyticsEvents.profileId,
    })
    .from(schema.analyticsEvents)
    .where(
      and(
        eq(schema.analyticsEvents.workspaceId, workspaceId),
        eq(schema.analyticsEvents.isBot, 0),
        gte(schema.analyticsEvents.timestamp, sinceTimestamp)
      )
    );

  let profileViews = 0;
  let nfcOpens = 0;
  let qrOpens = 0;
  let saveContactClicks = 0;
  let whatsappClicks = 0;
  let leadSubmissions = 0;

  const sourceCounts: Record<string, number> = {
    nfc: 0,
    qr: 0,
    direct: 0,
    campaign: 0,
  };

  const dailyBuckets: Record<string, { date: string; views: number; nfc: number; qr: number; leads: number }> = {};

  // Initialize last 7 days buckets
  for (let i = 6; i >= 0; i--) {
    const d = new Date((now - i * 86400) * 1000).toISOString().split("T")[0];
    dailyBuckets[d] = { date: d, views: 0, nfc: 0, qr: 0, leads: 0 };
  }

  for (const ev of events) {
    const evDate = new Date(ev.timestamp * 1000).toISOString().split("T")[0];

    switch (ev.eventType) {
      case "profile_view":
        profileViews++;
        if (dailyBuckets[evDate]) dailyBuckets[evDate].views++;
        break;
      case "nfc_open":
        nfcOpens++;
        if (dailyBuckets[evDate]) dailyBuckets[evDate].nfc++;
        break;
      case "qr_open":
        qrOpens++;
        if (dailyBuckets[evDate]) dailyBuckets[evDate].qr++;
        break;
      case "save_contact_click":
        saveContactClicks++;
        break;
      case "whatsapp_click":
        whatsappClicks++;
        break;
      case "lead_submitted":
        leadSubmissions++;
        if (dailyBuckets[evDate]) dailyBuckets[evDate].leads++;
        break;
    }

    const src = ev.sourceType || "direct";
    if (sourceCounts[src] !== undefined) {
      sourceCounts[src]++;
    } else {
      sourceCounts.direct++;
    }
  }

  // PRD Line 545-546: conversion = successful leads / eligible profile views * 100
  const conversionRate = profileViews > 0 ? ((leadSubmissions / profileViews) * 100).toFixed(1) : "0.0";

  const result = {
    profileViews,
    nfcOpens,
    qrOpens,
    saveContactClicks,
    whatsappClicks,
    leadSubmissions,
    conversionRate,
    sourceCounts,
    dailyTrend: Object.values(dailyBuckets),
  };

  fastCache.set(cacheKey, result, 60);
  return result;
}
