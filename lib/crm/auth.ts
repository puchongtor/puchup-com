/** SHA-256 of the admin password. The password itself is not stored in the repo. */
const PASS_HASH = "50d2581c30928a0650d74729bd19be311f7ea9ce819f97676444c4bb840c88c8";

export const AUTH_KEY = "puchup-crm-auth";

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyLogin(username: string, password: string): Promise<boolean> {
  if (username.trim() !== "admin") return false;
  const hex = await sha256(password);
  return hex === PASS_HASH;
}
