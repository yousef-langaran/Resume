import { isAuthenticated } from "./auth";

export async function requireAuth() {
  const auth = await isAuthenticated();
  if (!auth) {
    throw new Error("UNAUTHORIZED");
  }
}
