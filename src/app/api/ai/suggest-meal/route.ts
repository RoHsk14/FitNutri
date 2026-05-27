import { NextResponse } from "next/server"
import { suggestMealAction } from "@/lib/actions"

export async function POST(req: Request) {
  const fd = await req.formData()
  const result = await suggestMealAction(fd)
  return NextResponse.json(result)
}
