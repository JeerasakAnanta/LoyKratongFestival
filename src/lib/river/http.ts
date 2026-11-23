import "server-only";
import { NextResponse } from "next/server";
import type { Failure } from "./service";

const STATUS: Record<Failure, number> = {
  "bad-request": 400,
  profanity: 422,
  contact: 422,
  "rate-limit": 429,
  "not-found": 404,
  already: 409,
  server: 502,
};

export function fail(error: Failure) {
  return NextResponse.json({ error }, { status: STATUS[error] });
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
