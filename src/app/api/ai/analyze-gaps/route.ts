import { NextResponse } from "next/server"
import { analyzeGapsAction } from "@/lib/actions"

export async function POST() {
  const result = await analyzeGapsAction()
  if (!result) return new NextResponse(null, { status: 204 })
  return NextResponse.json(result)
}
