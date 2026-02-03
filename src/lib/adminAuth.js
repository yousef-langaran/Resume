import { isAuthenticated } from "./auth";

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error("UNAUTHORIZED");
  }
}
