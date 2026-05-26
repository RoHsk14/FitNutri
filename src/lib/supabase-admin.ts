import { createClient } from "@supabase/supabase-js"

/** Client Supabase avec le rôle service (bypass RLS).
 *  À utiliser UNIQUEMENT côté serveur (server actions, API routes). */
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
}

const STORAGE_BUCKET = "fit-physique-images"
export { STORAGE_BUCKET }

/** Crée le bucket s'il n'existe pas */
export async function ensureBucket() {
  const supabase = getSupabaseAdmin()
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === STORAGE_BUCKET)) {
    await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    })
  }
}
