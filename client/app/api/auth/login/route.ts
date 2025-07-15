import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { email, ocid } = body

    console.log("Login attempt:", { email, ocid })

    // Validate required fields
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    if (!ocid) {
      return NextResponse.json({ success: false, message: "OCID is required" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, we'll just return success if OCID matches our test value
    if (ocid === "ocid_3b3wzr1ip") {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          email,
          ocid,
        },
      })
    } else {
      console.log("Invalid OCID:", ocid)
      return NextResponse.json({ success: false, message: "Invalid OCID" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}
