import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
  checkAdminCredentials,
  createAdminSession,
  getAdminConfig,
  isSameOriginRequest,
} from "@/lib/admin-auth";

export async function POST(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const config = getAdminConfig();
  if (config.missing.length) {
    return NextResponse.json({ error: `Admin login is not configured. Set: ${config.missing.join(", ")}.` }, { status: 503 });
  }

  try {
    const { username, password } = await request.json();
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Enter a username and password." }, { status: 400 });
    }

    const result = checkAdminCredentials(username, password);
    if (!result.valid) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(), adminCookieOptions());
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid login request." }, { status: 400 });
  }
}
