const providerEnv = (
  process.env.DATA_PROVIDER ??
  process.env.NEXT_PUBLIC_DATA_PROVIDER ??
  "mock"
).toLowerCase();

export const dataProvider = providerEnv === "supabase" ? "supabase" : "mock";

export const isMockMode = dataProvider === "mock";

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

export const isSupabaseConfigured = Boolean(
  supabaseConfig.url && supabaseConfig.anonKey,
);

export const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5582996265666";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const adminEmailAllowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const adminBypassAuth =
  (process.env.ADMIN_BYPASS_AUTH ?? (isMockMode ? "true" : "false")).toLowerCase() ===
  "true";
