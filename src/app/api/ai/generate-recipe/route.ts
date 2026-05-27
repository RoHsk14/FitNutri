import { NextResponse } from "next/server"
import { generateRecipeAction } from "@/lib/actions"

export async function POST(req: Request) {
  const fd = await req.formData()
  const result = await generateRecipeAction(fd)
  return NextResponse.json(result)
}
