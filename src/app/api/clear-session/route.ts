import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = cookies()
  cookieStore.delete("fit_user_id")
  return NextResponse.json({ ok: true })
}
