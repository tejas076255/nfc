"use server";

import { z } from "zod";
import { getDb, schema } from "../db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./password";
import { createSession, destroySession } from "./session";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  const result = registerSchema.safeParse({ name, email, password });
  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Validation failed" };
  }

  const db = await getDb();
  const [existingUser] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  const now = Math.floor(Date.now() / 1000);
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  // Check if first user in system should be super_admin or user
  const userCount = await db.select({ id: schema.users.id }).from(schema.users).limit(2);
  const role = userCount.length === 0 ? "super_admin" : "user";

  // Create user
  await db.insert(schema.users).values({
    id: userId,
    email,
    name,
    passwordHash,
    role,
    createdAt: now,
    updatedAt: now,
  });

  // Create personal workspace
  const workspaceId = crypto.randomUUID();
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const workspaceSlug = `${baseSlug || "workspace"}-${randomSuffix}`;

  await db.insert(schema.workspaces).values({
    id: workspaceId,
    name: `${name}'s Workspace`,
    slug: workspaceSlug,
    type: "personal",
    ownerId: userId,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });

  // Create workspace membership
  await db.insert(schema.workspaceMemberships).values({
    id: crypto.randomUUID(),
    workspaceId,
    userId,
    role: "owner",
    status: "active",
    createdAt: now,
  });

  // Initialize Free Subscription
  const oneYearLater = now + 365 * 24 * 60 * 60;
  await db.insert(schema.subscriptions).values({
    id: crypto.randomUUID(),
    workspaceId,
    planId: "plan_free",
    status: "active",
    currentPeriodStart: now,
    currentPeriodEnd: oneYearLater,
    createdAt: now,
    updatedAt: now,
  });

  // Create session
  await createSession(userId);

  return redirect("/dashboard");
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  const returnTo = (formData.get("returnTo") as string) || "/dashboard";

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.errors[0]?.message || "Validation failed" };
  }

  const db = await getDb();
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const hash = user.passwordHash || (user as any).password_hash;
  if (!hash) {
    return { error: "Invalid email or password" };
  }

  const isValid = await verifyPassword(password, hash);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  await createSession(user.id);
  const safeReturn = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/dashboard";
  return redirect(safeReturn);
}

export async function logoutAction() {
  await destroySession();
  return redirect("/login");
}
