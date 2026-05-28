import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(null, { status: 401 })

  const admin = getSupabaseAdmin()
  const { data } = await admin
    .from("fit_user_profiles")
    .select("id, name, goal, age, target_calories, is_admin")
    .eq("clerk_user_id", user.id)
    .single()

  if (!data) return NextResponse.json(null, { status: 401 })

  return NextResponse.json({
    ...data,
    admin: data.is_admin,
  })
}
