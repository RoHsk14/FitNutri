import { NextResponse } from "next/server"
import { generateCustomWorkoutAction } from "@/lib/actions"

export async function POST(req: Request) {
  const fd = await req.formData()
  const result = await generateCustomWorkoutAction(fd)
  if (!result) return new NextResponse(null, { status: 204 })
  return NextResponse.json(result)
}
