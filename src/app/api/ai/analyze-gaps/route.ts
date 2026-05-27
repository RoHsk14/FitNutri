import { NextResponse } from "next/server"
import { analyzeGapsAction } from "@/lib/actions"

export async function POST() {
  const result = await analyzeGapsAction()
  return NextResponse.json(result)
}
