import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const trackId = searchParams.get("trackId")

  if (!trackId) {
    return NextResponse.json({ error: "Track ID is required" }, { status: 400 })
  }

  // Call the Qobuz API to get the preview URL
  try {
    // Use your existing authentication methods from the app
    // Example URL structure - replace with actual implementation
    const response = await fetch(
      `https://www.qobuz.com/api.json/0.2/track/getFileUrl?track_id=${trackId}&format_id=5`,
      {
        headers: {
          // Include your auth headers here
          "X-App-Id": process.env.QOBUZ_APP_ID || "",
          "X-User-Auth-Token": process.env.QOBUZ_USER_AUTH_TOKEN || "",
        },
      },
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to get preview URL" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ previewUrl: data.url })
  } catch (error) {
    console.error("Error getting preview URL:", error)
    return NextResponse.json({ error: "Failed to get preview URL" }, { status: 500 })
  }
}

