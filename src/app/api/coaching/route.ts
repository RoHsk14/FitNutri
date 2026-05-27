import { NextResponse } from "next/server"
import { getCoachingMessage } from "@/lib/actions"

export async function GET() {
  const msg = await getCoachingMessage()
  return NextResponse.json(msg)
}
