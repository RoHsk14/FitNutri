import { NextResponse } from "next/server"
import { getCoachingMessage } from "@/lib/actions"

export async function GET() {
  const msg = await getCoachingMessage()
  if (!msg) return new NextResponse(null, { status: 204 })
  return NextResponse.json(msg)
}
