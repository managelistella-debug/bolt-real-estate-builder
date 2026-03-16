const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID || process.env.ASPEN_TENANT_ID || "aspen";

export function getTenantId() {
  return TENANT_ID;
}
