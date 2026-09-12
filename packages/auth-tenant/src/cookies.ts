import { isProduction } from "./env";

export const PREAUTH_COOKIE = isProduction() ? "__Host-subiza_preauth" : "subiza_preauth";

export const SESSION_COOKIE = isProduction() ? "__Host-subiza_session" : "subiza_session";

export const DEVICE_COOKIE = isProduction() ? "__Host-subiza_dev" : "subiza_dev";

export const ENTRY_COOKIE = "subiza_entry";

export const ENTRY_PHONE_COOKIE = "subiza_entry_phone";

export type CookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
};

export function hostCookie(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}
