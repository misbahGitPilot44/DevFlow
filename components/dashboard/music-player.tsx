"use client"

import { useState, useRef, useEffect } from "react"
import { Music, Youtube, ExternalLink, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

interface Track {
  id: string
  title: string
  artist: string
  duration: string
  category: "motivational" | "relaxing" | "focus" | "energetic"
  audioUrl?: string
  youtubeId?: string
  type: "generated" | "youtube"
}

interface MusicPlayerProps {
  effectiveTheme: "dark" | "light"
}

export default function MusicPlayer({ effectiveTheme }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [volume, setVolume] = useState(70)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedMusicCategory, setSelectedMusicCategory] = useState<
    "motivational" | "relaxing" | "focus" | "energetic"
  >("motivational")
  const [musicMode, setMusicMode] = useState<"generated" | "youtube">("generated")

  const musicTracks: Record<string, Track[]> = {
    motivational: [
      {
        id: "m1",
        title: "Motivational Beat 1",
        artist: "AI Generated",
        duration: "3:24",
        category: "motivational",
        type: "generated",
        audioUrl: "/audio/motivational-1.mp3",
      },
      {
        id: "m2",
        title: "Motivational Beat 2",
        artist: "AI Generated",
        duration: "3:07",
        category: "motivational",
        type: "generated",
        audioUrl: "/audio/motivational-2.mp3",
      },
      {
        id: "m3",
        title: "Believer",
        artist: "Imagine Dragons",
        duration: "3:24",
        category: "motivational",
        type: "youtube",
        youtubeId: "LRMLUfJZhWg",
      },
    ],
    relaxing: [
      {
        id: "r1",
        title: "Relaxing Ambient",
        artist: "AI Generated",
        duration: "4:15",
        category: "relaxing",
        type: "generated",
        audioUrl: "/audio/relaxing-1.mp3",
      },
      {
        id: "r2",
        title: "Weightless",
        artist: "Marconi Union",
        duration: "8:10",
        category: "relaxing",
        type: "youtube",
        youtubeId: "UfcAVejslrU",
      },
    ],
    focus: [
      {
        id: "f1",
        title: "Focus Music for Work and Studying",
        artist: "Greenred Productions",
        duration: "9:08:53",
        category: "focus",
        type: "youtube",
        youtubeId: "_4kHxtiuML0",
      },
    ],
    energetic: [
      {
        id: "e1",
        title: "Energetic Workout",
        artist: "AI Generated",
        duration: "2:45",
        category: "energetic",
        type: "generated",
        audioUrl: "/audio/energetic-1.mp3",
      },
      {
        id: "e2",
        title: "Shape Of You",
        artist: "Ed Sheeran",
        duration: "4:23",
        category: "energetic",
        type: "youtube",
        youtubeId: "whkk7V2T80w",
      },
    ],
  }

  const currentPlaylist = musicTracks[selectedMusicCategory]?.filter((track) => track.type === musicMode) || []
  const currentTrack = currentPlaylist[currentTrackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(Math.floor(audio.currentTime))
    const updateDuration = () => setDuration(Math.floor(audio.duration))
    const handleEnded = () => {
      setIsPlaying(false)
      playNextTrack()
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentTrack])

  useEffect(() => {
    if (currentTrack && currentTrack.type === "generated" && currentTrack.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = currentTrack.audioUrl
        audioRef.current.load()
      } else {
        audioRef.current = new Audio(currentTrack.audioUrl)
      }
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    setCurrentTrackIndex(0)
    setIsPlaying(false)
  }, [selectedMusicCategory, musicMode])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlayPause = async () => {
    try {
      if (currentTrack?.type === "generated" && audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          await audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    } catch (error) {
      console.log("Audio playback error:", error)
    }
  }

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.length
    setCurrentTrackIndex(nextIndex)
    setCurrentTime(0)
  }

  const playPreviousTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length
    setCurrentTrackIndex(prevIndex)
    setCurrentTime(0)
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0]
    setVolume(volumeValue)
  }

  const changeCategory = (category: "motivational" | "relaxing" | "focus" | "energetic") => {
    setSelectedMusicCategory(category)
    setCurrentTrackIndex(0)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const openYouTubeVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank")
  }

  const getMusicCategoryColor = (category: string) => {
    switch (category) {
      case "motivational":
        return "bg-orange-500 hover:bg-orange-600"
      case "relaxing":
        return "bg-teal-500 hover:bg-teal-600"
      case "focus":
        return "bg-indigo-500 hover:bg-indigo-600"
      case "energetic":
        return "bg-rose-500 hover:bg-rose-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card
      className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
          Workout Music
        </CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setMusicMode(musicMode === "generated" ? "youtube" : "generated")}
            className={`${musicMode === "generated" ? "bg-purple-500 hover:bg-purple-600" : "bg-red-500 hover:bg-red-600"}`}
          >
            {musicMode === "generated" ? "AI Music" : "YouTube"}
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
            <Music size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Music Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            onClick={() => changeCategory("motivational")}
            className={`${selectedMusicCategory === "motivational" ? getMusicCategoryColor("motivational") : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Motivational
          </Button>
          <Button
            size="sm"
            onClick={() => changeCategory("relaxing")}
            className={`${selectedMusicCategory === "relaxing" ? getMusicCategoryColor("relaxing") : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Relaxing
          </Button>
          <Button
            size="sm"
            onClick={() => changeCategory("focus")}
            className={`${selectedMusicCategory === "focus" ? getMusicCategoryColor("focus") : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Focus
          </Button>
          <Button
            size="sm"
            onClick={() => changeCategory("energetic")}
            className={`${selectedMusicCategory === "energetic" ? getMusicCategoryColor("energetic") : "bg-gray-700 hover:bg-gray-600"}`}
          >
            Energetic
          </Button>
        </div>

        {/* Now Playing */}
        <div className={`p-4 rounded-lg mb-4 ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-lg ${getMusicCategoryColor(selectedMusicCategory)} flex items-center justify-center ${isPlaying ? "animate-pulse" : ""}`}
            >
              {musicMode === "generated" ? (
                <Music size={24} className={`text-white ${isPlaying ? "animate-pulse" : ""}`} />
              ) : (
                <Youtube size={24} className={`text-white ${isPlaying ? "animate-pulse" : ""}`} />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                {currentTrack?.title || "Select a track"}
              </h3>
              <p className="text-sm text-gray-400">{currentTrack?.artist || "Artist"}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Badge variant="outline" className="text-xs">
                  {musicMode === "generated" ? "AI Generated" : "YouTube"}
                </Badge>
                <span>{currentTrack?.duration || "--:--"}</span>
              </div>
            </div>
            {isPlaying && <div className="text-green-400 text-sm font-medium">♪ Playing</div>}
          </div>

          {/* Audio Controls for Generated Music */}
          {musicMode === "generated" && currentTrack && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={playPreviousTrack} variant="outline" className="p-2">
                  <SkipBack size={14} />
                </Button>
                <Button size="sm" onClick={togglePlayPause} className="bg-green-500 hover:bg-green-600 p-2">
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </Button>
                <Button size="sm" onClick={playNextTrack} variant="outline" className="p-2">
                  <SkipForward size={14} />
                </Button>
                <div className="flex items-center gap-2 flex-1">
                  <Volume2 size={14} className="text-gray-400" />
                  <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
                  <span className="text-xs text-gray-400 w-8">{volume}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <Progress value={(currentTime / duration) * 100} className="flex-1 h-1" />
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* YouTube Embed for YouTube mode */}
          {musicMode === "youtube" && currentTrack?.youtubeId && (
            <div className="mt-4">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=0&controls=1`}
                title={currentTrack.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Playlist */}
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {currentPlaylist.map((track, index) => (
            <div
              key={track.id}
              onClick={() => selectTrack(index)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                currentTrackIndex === index
                  ? effectiveTheme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-200"
                  : effectiveTheme === "dark"
                    ? "hover:bg-gray-800/70"
                    : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full ${getMusicCategoryColor(track.category)} flex items-center justify-center`}
                >
                  {currentTrackIndex === index && isPlaying ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : musicMode === "generated" ? (
                    <Music size={12} className="text-white" />
                  ) : (
                    <Youtube size={12} className="text-white" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-gray-400">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{track.duration}</span>
                {musicMode === "youtube" && track.youtubeId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      openYouTubeVideo(track.youtubeId!)
                    }}
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                  >
                    <ExternalLink size={12} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
