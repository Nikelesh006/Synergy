/**
 * Admin check utility.
 * The allowed admin email addresses are kept ONLY in the environment variable VITE_ADMIN_EMAILS.
 * Example in .env: VITE_ADMIN_EMAILS=synergytechlabs.help@gmail.com,codecraft2k@gmail.com
 */
export function getAdminEmails(): string[] {
  const envVal = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || "";
  return envVal
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAdmin(email?: string | null): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.trim().toLowerCase());
}
