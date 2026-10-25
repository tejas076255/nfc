/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  NFC_SAAS_JOBS: Queue;
  NEXT_PUBLIC_APP_URL?: string;
  BETTER_AUTH_SECRET?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
}
