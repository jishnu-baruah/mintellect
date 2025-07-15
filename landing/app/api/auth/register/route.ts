import { NextResponse } from "next/server"
import { UserTier } from "@/types/user"

export async function POST(request: Request) {
  try {
    // In a real app, this would validate and store user data
    const body = await request.json()

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.ocid || !body.mail) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        _id: "user_" + Math.random().toString(36).substr(2, 9),
        ocid: body.ocid,
        name: `${body.firstName} ${body.lastName}`,
        mail: body.mail,
        userTier: UserTier.Free,
        credits: 100, // Starting credits for new users
        avatar: "/placeholder.svg?height=200&width=200",
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 })
  }
}

