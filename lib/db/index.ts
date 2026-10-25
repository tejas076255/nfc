import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// Types for Cloudflare D1
export interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean; meta: Record<string, unknown> }>;
  run(): Promise<{ success: boolean; meta: Record<string, unknown> }>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<Array<{ results: T[]; success: boolean }>>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

// REST Client for Cloudflare D1 during local development / node runtime
class D1RestClient implements D1Database {
  private accountId: string;
  private databaseId: string;
  private apiKey: string;
  private email: string;
  private endpoint: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
    this.databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || "";
    this.apiKey = process.env.CLOUDFLARE_API_KEY || "";
    this.email = process.env.CLOUDFLARE_EMAIL || "";
    this.endpoint = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
  }

  private async executeQuery(sql: string, params: unknown[] = []): Promise<any> {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "X-Auth-Key": this.apiKey,
        "X-Auth-Email": this.email,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });

    const data = (await res.json()) as any;
    if (!data.success && data.errors && data.errors.length > 0) {
      throw new Error(`D1 REST API Error: ${data.errors[0]?.message || "Unknown error"}`);
    }
    return data.result?.[0] || { results: [], success: true, meta: {} };
  }

  prepare(query: string): D1PreparedStatement {
    const self = this;
    let boundParams: unknown[] = [];

    return {
      bind(...params: unknown[]) {
        boundParams = params;
        return this;
      },
      async first<T = unknown>(colName?: string): Promise<T | null> {
        const result = await self.executeQuery(query, boundParams);
        const row = result.results?.[0];
        if (!row) return null;
        if (colName) return row[colName] ?? null;
        return row as T;
      },
      async all<T = unknown>() {
        const result = await self.executeQuery(query, boundParams);
        return {
          results: (result.results || []) as T[],
          success: true,
          meta: result.meta || {},
        };
      },
      async run() {
        const result = await self.executeQuery(query, boundParams);
        return {
          success: true,
          meta: result.meta || {},
        };
      },
      async raw<T = unknown[]>() {
        const result = await self.executeQuery(query, boundParams);
        const rows = result.results || [];
        return rows.map((r: any) => Object.values(r)) as T[];
      },
    };
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<Array<{ results: T[]; success: boolean }>> {
    const results: Array<{ results: T[]; success: boolean }> = [];
    for (const stmt of statements) {
      const res = await stmt.all<T>();
      results.push({ results: res.results, success: res.success });
    }
    return results;
  }

  async exec(query: string) {
    const res = await this.executeQuery(query);
    return { count: res.meta?.changes || 0, duration: res.meta?.duration || 0 };
  }
}

// Global cache for DB client
let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function getDb() {
  // If we are in OpenNext Cloudflare runtime, check for binding
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext();
    if ((ctx?.env as any)?.DB) {
      return drizzle((ctx.env as any).DB as any, { schema });
    }
  } catch {
    // Falling back to REST client in local node runtime
  }

  if (!cachedDb) {
    const d1Rest = new D1RestClient();
    cachedDb = drizzle(d1Rest as any, { schema });
  }

  return cachedDb;
}

export { schema };
