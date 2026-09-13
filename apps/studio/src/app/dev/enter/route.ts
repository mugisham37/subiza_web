import { SESSION_COOKIE, hostCookie, mintSession } from "@subiza/auth-tenant";
import { getStore } from "@subiza/auth-tenant";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }
  const store = getStore();
  const tenant = [...store.tenants.values()].find((row) => row.name === "Salon Ubwiza");
  const member = tenant
    ? [...store.members.values()].find((row) => row.tenantId === tenant.id && row.role === "owner")
    : undefined;
  if (!tenant || !member) {
    return new Response("seed missing", { status: 500 });
  }
  const session = mintSession({
    personId: tenant.ownerPersonId,
    tenantId: tenant.id,
    memberId: member.id,
    strength: "otp",
  });
  (await cookies()).set(SESSION_COOKIE, session.id, hostCookie(14 * 24 * 60 * 60));
  return NextResponse.redirect(new URL("/activate", request.url));
}
