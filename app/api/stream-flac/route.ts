import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    // Fetch the audio file
    const audioResponse = await fetch(url)

    if (!audioResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch audio" }, { status: audioResponse.status })
    }

    // Get the audio data as ArrayBuffer
    const audioData = await audioResponse.arrayBuffer()

    // Create a new response with the audio data
    const response = new NextResponse(audioData)

    // Set appropriate headers
    response.headers.set("Content-Type", "audio/flac")
    response.headers.set("Content-Length", audioData.byteLength.toString())
    response.headers.set("Accept-Ranges", "bytes")

    return response
  } catch (error) {
    console.error("Error streaming FLAC:", error)
    return NextResponse.json({ error: "Failed to stream audio" }, { status: 500 })
  }
}

