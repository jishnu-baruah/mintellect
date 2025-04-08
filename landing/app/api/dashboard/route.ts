import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    
    // Check if we have a valid authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Extract the token
    const token = authHeader.split(" ")[1]

    // Validate the token
    // In production, you would verify this token with Open Campus
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      )
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Dashboard redirect error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
} 