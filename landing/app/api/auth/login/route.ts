import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { email, ocid, accessToken } = body

    console.log("Login attempt:", { email, ocid })

    // Validate required fields
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    if (!ocid) {
      return NextResponse.json({ success: false, message: "OCID is required" }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Access token is required" }, { status: 400 })
    }

    // More lenient OCID validation
    // OCIDs from Open Campus can have various formats
    if (typeof ocid !== 'string' || ocid.trim().length === 0) {
      return NextResponse.json({ success: false, message: "Invalid OCID" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For now, we'll accept any non-empty OCID
    // In production, you would verify the OCID and access token with Open Campus
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        email,
        ocid,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Authentication failed. Please try again." 
    }, { status: 500 })
  }
}

