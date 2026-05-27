import { NextResponse } from "next/server"
import { generateCustomWorkoutAction } from "@/lib/actions"

export async function POST(req: Request) {
  const fd = await req.formData()
  const result = await generateCustomWorkoutAction(fd)
  return NextResponse.json(result)
}
