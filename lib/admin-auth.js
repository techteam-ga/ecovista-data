import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "ecovista_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  const missing = [
    !username && "ADMIN_USERNAME",
    !password && "ADMIN_PASSWORD",
    !secret && "ADMIN_SESSION_SECRET",
  ].filter(Boolean);

  if (secret && secret.length < 32) missing.push("ADMIN_SESSION_SECRET (must be at least 32 characters)");
  return { username, password, secret, missing };
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function checkAdminCredentials(username, password) {
  const config = getAdminConfig();
  if (config.missing.length) return { configured: false, valid: false };
  return {
    configured: true,
    valid: safeEqual(username, config.username) && safeEqual(password, config.password),
  };
}

export function createAdminSession() {
  const { username, secret } = getAdminConfig();
  const payload = Buffer.from(JSON.stringify({
    username,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function isValidAdminSession(token) {
  if (!token) return false;
  const config = getAdminConfig();
  if (config.missing.length) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  if (!safeEqual(signature, sign(payload, config.secret))) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.username === config.username && Number(session.expiresAt) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function hasAdminSession(request) {
  return isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function isSameOriginRequest(request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = request.headers.get("origin");
  if (!origin) return fetchSite === "same-origin";

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0].trim();
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
    const requestHost = forwardedHost || request.headers.get("host") || requestUrl.host;
    const requestProtocol = forwardedProtocol ? `${forwardedProtocol.replace(/:$/, "")}:` : requestUrl.protocol;
    return originUrl.host === requestHost && originUrl.protocol === requestProtocol;
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}
