import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate successful payment (you can add conditions to simulate failures)
  const success = Math.random() > 0.2 // 80% success rate

  if (success) {
    return NextResponse.json({ success: true, message: "Payment processed successfully" })
  } else {
    return NextResponse.json({ success: false, message: "Payment failed" }, { status: 400 })
  }
}

