import { cookies } from "next/headers";
import { Locale } from "@/lib/data";
import { LOCALE_COOKIE } from "@/lib/locale-cookie";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value === "zh" ? "zh" : "en";
}
