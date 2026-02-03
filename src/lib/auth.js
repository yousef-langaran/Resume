import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const USER_SESSION_COOKIE = "user_session";
const SESSION_SECRET = process.env.JWT_SECRET || "default-secret-change-me";

export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function sign(data) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
}

export function createSessionToken(email) {
  const data = `${email}:${Date.now()}`;
  const signature = sign(data);
  return Buffer.from(`${data}:${signature}`).toString("base64");
}

function verifySessionToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [email, timestamp, signature] = decoded.split(":");
    if (!email || !timestamp || !signature) return false;
    const validSignature = sign(`${email}:${timestamp}`);
    if (signature !== validSignature) return false;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    if (Date.now() - parseInt(timestamp, 10) > maxAge) return false;
    return true;
  } catch {
    return false;
  }
}

export async function setSession(token) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated() {
  const token = await getSession();
  return !!token && verifySessionToken(token);
}

// --- User session (for registered users / resume owners) ---
export function createUserSessionToken(userId) {
  const data = `user:${userId}:${Date.now()}`;
  const signature = sign(data);
  return Buffer.from(`${data}:${signature}`).toString("base64");
}

function verifyUserSessionToken(token) {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const parts = decoded.split(":");
    if (parts.length < 4) return null;
    const [, userId, timestamp, signature] = parts;
    const data = `user:${userId}:${timestamp}`;
    const validSignature = sign(data);
    if (signature !== validSignature) return null;
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    if (Date.now() - parseInt(timestamp, 10) > maxAge) return null;
    return userId;
  } catch {
    return null;
  }
}

export async function setUserSession(token) {
  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getUserSession() {
  const cookieStore = await cookies();
  return cookieStore.get(USER_SESSION_COOKIE)?.value;
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_SESSION_COOKIE);
}

export async function getCurrentUserId() {
  const token = await getUserSession();
  if (!token) return null;
  return verifyUserSessionToken(token);
}

export async function requireUser() {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("UNAUTHORIZED");
  return userId;
}
