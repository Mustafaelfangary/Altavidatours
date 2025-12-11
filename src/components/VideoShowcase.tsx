"use client"

import { useState } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  return (
    <div className="relative h-[60vh] w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/nile-cruise.mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Experience the Nile</h1>
          <p className="text-xl mb-8">Luxury cruises through ancient wonders</p>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => {
            const video = document.querySelector('video')
            if (video) {
              if (video.paused) {
                video.play()
              } else {
                video.pause()
              }
            }
          }}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30"
        >
          {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30"
        >
          {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
        </button>
      </div>
    </div>
  )
}


