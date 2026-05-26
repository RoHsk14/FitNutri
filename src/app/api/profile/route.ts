import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = cookies()
  const userId = cookieStore.get("fit_user_id")?.value
  if (!userId) return NextResponse.json(null, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from("fit_user_profiles")
    .select("id, goal, age, target_calories")
    .eq("clerk_user_id", userId)
    .single()

  return NextResponse.json(data)
}
