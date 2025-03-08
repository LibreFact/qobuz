"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface MusicPlayerProps {
  src?: string
  trackTitle?: string
  artistName?: string
  albumName?: string
  onClose?: () => void
}

export function MusicPlayer({
  src,
  trackTitle = "Unknown Track",
  artistName = "Unknown Artist",
  albumName = "Unknown Album",
  onClose,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!src) return

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    // Reset player state
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsLoading(true)

    // Set up audio source
    audioRef.current.src = src
    audioRef.current.volume = volume

    // Set up event listeners
    const audio = audioRef.current

    const handleLoadedData = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)

      audio.pause()
    }
  }, [src, volume])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }

    // If volume is changed to > 0, unmute
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
      if (audioRef.current) {
        audioRef.current.muted = false
      }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value)
    setCurrentTime(seekTime)
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime
    }
  }

  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Track info and progress */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1 mr-4 truncate">
            <h3 className="font-medium truncate">{trackTitle}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {artistName} • {albumName}
            </p>
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Seek bar (using input range instead of Slider) */}
        <div className="mb-4">
          {isLoading ? (
            <Progress value={0} className="h-1" />
          ) : (
            <input
              type="range"
              value={currentTime}
              min={0}
              max={duration || 100}
              step={0.1}
              onChange={handleSeek}
              className="w-full"
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0
                }
              }}
              disabled={isLoading}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button variant="outline" size="icon" className="h-10 w-10" onClick={togglePlayPause} disabled={isLoading}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (audioRef.current && duration) {
                  audioRef.current.currentTime = duration
                }
              }}
              disabled={isLoading}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 w-32">
            <Button variant="ghost" size="icon" onClick={toggleMute} disabled={isLoading}>
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <input
              type="range"
              value={isMuted ? 0 : volume}
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              className="w-full"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
