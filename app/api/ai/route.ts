import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { text } = await req.json()

  // simple smart detection logic
  let category = "Other"
  let priority = "Medium"

  const msg = text.toLowerCase()

  if (msg.includes("fan") || msg.includes("light") || msg.includes("switch") || msg.includes("electric")) {
    category = "Electrical"
    priority = "High"
  }
  else if (msg.includes("water") || msg.includes("pipe") || msg.includes("leak") || msg.includes("bathroom")) {
    category = "Plumbing"
    priority = "Medium"
  }
  else if (msg.includes("clean") || msg.includes("garbage")) {
    category = "Cleaning"
    priority = "Low"
  }
  else if (msg.includes("security") || msg.includes("theft") || msg.includes("gate")) {
    category = "Security"
    priority = "High"
  }

  return NextResponse.json({
    category,
    priority
  })
}
