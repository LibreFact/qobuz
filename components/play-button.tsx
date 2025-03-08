"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MusicPlayer } from "./music-player"

interface PlayButtonProps {
  trackUrl?: string
  trackTitle?: string
  artistName?: string
  albumName?: string
  disabled?: boolean
}

export function PlayButton({ trackUrl, trackTitle, artistName, albumName, disabled = false }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    if (trackUrl) {
      setIsPlaying(true)
    }
  }

  const handleClose = () => {
    setIsPlaying(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePlay}
        disabled={disabled || !trackUrl}
        title="Play track"
        className="h-8 w-8 rounded-full"
      >
        <Play className="h-4 w-4" />
      </Button>

      {isPlaying && (
        <MusicPlayer
          src={trackUrl}
          trackTitle={trackTitle}
          artistName={artistName}
          albumName={albumName}
          onClose={handleClose}
        />
      )}
    </>
  )
}

