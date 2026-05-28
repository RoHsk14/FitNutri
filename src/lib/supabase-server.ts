import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

/**
 * Client Supabase avec SSR (cookies).
 * À utiliser dans les Server Actions et Route Handlers uniquement.
 * Pour les Server Components, utiliser getSupabaseReadonlyClient().
 */
export async function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[],
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

/**
 * Client Supabase lecture seule pour les Server Components.
 * setAll est no-op car le middleware gère déjà les cookies,
 * et cookies().set() n'est pas autorisé dans les Server Components.
 */
export async function getSupabaseReadonlyClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // No-op : le middleware gère le refresh des cookies
        },
      },
    }
  )
}
