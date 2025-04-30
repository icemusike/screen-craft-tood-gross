import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { Play, Pause, SkipBack, SkipForward, Scissors, Sparkles, Download, Save, ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import Button from '../components/ui/Button'
import { useRecordingStore } from '../store/recordingStore'

const Editor = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recordings, updateRecording } = useRecordingStore()
  
  const [recording, setRecording] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const [aiEnhancements, setAiEnhancements] = useState({
    removeBackground: false,
    enhanceAudio: false,
    autoCaption: false,
  })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const ffmpegRef = useRef(new FFmpeg())
  const progressBarRef = useRef<HTMLDivElement>(null)
  
  // Load recording data
  useEffect(() => {
    if (id) {
      const foundRecording = recordings.find(rec => rec.id === id)
      if (foundRecording) {
        setRecording(foundRecording)
        setTrimEnd(foundRecording.duration)
      } else {
        navigate('/library')
      }
    }
  }, [id, recordings, navigate])
  
  // Initialize FFmpeg
  useEffect(() => {
    const load = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      const ffmpeg = ffmpegRef.current
      
      try {
        // Load FFmpeg core
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        })
        
        setFfmpegLoaded(true)
      } catch (error) {
        console.error('Error loading FFmpeg:', error)
      }
    }
    
    load()
  }, [])
  
  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current
    
    if (videoElement && recording) {
      // Set video source
      videoElement.src = recording.videoUrl
      
      // Event listeners
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime)
      }
      
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration)
        setTrimEnd(videoElement.duration)
      }
      
      const handleEnded = () => {
        setIsPlaying(false)
      }
      
      // Add event listeners
      videoElement.addEventListener('timeupdate', handleTimeUpdate)
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
      videoElement.addEventListener('ended', handleEnded)
      
      // Set volume
      videoElement.volume = volume
      
      // Clean up
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate)
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
        videoElement.removeEventListener('ended', handleEnded)
      }
    }
  }, [recording, volume])
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Play/pause video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  
  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }
  
  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = pos * duration
    }
  }
  
  // Handle trim start/end change
  const handleTrimChange = (type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      setTrimStart(Math.min(value, trimEnd - 1))
    } else {
      setTrimEnd(Math.max(value, trimStart + 1))
    }
  }
  
  // Toggle AI enhancement
  const toggleAIEnhancement = (enhancement: keyof typeof aiEnhancements) => {
    setAiEnhancements(prev => ({
      ...prev,
      [enhancement]: !prev[enhancement]
    }))
  }
  
  // Process video with FFmpeg
  const processVideo = async () => {
    if (!ffmpegLoaded || !recording || !videoRef.current) {
      return
    }
    
    setIsProcessing(true)
    
    try {
      const ffmpeg = ffmpegRef.current
      const inputFileName = 'input.webm'
      const outputFileName = 'output.mp4'
      
      // Write input file to memory
      await ffmpeg.writeFile(inputFileName, await fetchFile(recording.videoUrl))
      
      // Build FFmpeg command
      let command = `-i ${inputFileName} -ss ${trimStart} -to ${trimEnd}`
      
      // Add AI enhancements (simulated)
      if (aiEnhancements.enhanceAudio) {
        command += ' -af "highpass=f=200,lowpass=f=3000,volume=2"'
      }
      
      // Output format
      command += ` -c:v libx264 -preset fast -c:a aac ${outputFileName}`
      
      // Execute command
      await ffmpeg.exec(command.split(' '))
      
      // Read the output file
      const data = await ffmpeg.readFile(outputFileName)
      const blob = new Blob([data], { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)
      
      // Update recording
      const updatedRecording = {
        ...recording,
        videoUrl: url,
        processed: true,
      }
      
      updateRecording(recording.id, updatedRecording)
      setRecording(updatedRecording)
      
      // Reset video player
      if (videoRef.current) {
        videoRef.current.src = url
        videoRef.current.currentTime = 0
      }
      
      alert('Video processed successfully!')
    } catch (error) {
      console.error('Error processing video:', error)
      alert('Error processing video. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Download processed video
  const downloadVideo = () => {
    if (recording) {
      const a = document.createElement('a')
      a.href = recording.videoUrl
      a.download = `${recording.title}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
  
  // Save changes
  const saveChanges = () => {
    if (recording) {
      const updatedRecording = {
        ...recording,
        title: recording.title,
      }
      
      updateRecording(recording.id, updatedRecording)
      navigate('/library')
    }
  }
  
  if (!recording) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recording...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/library')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{recording.title}</h1>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={downloadVideo}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button 
            onClick={saveChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      {/* Video Player */}
      <div className="bg-black rounded-lg overflow-hidden shadow-xl mb-6">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          onClick={togglePlay}
        />
        
        {/* Video Controls */}
        <div className="bg-gray-900 text-white p-4">
          {/* Progress Bar */}
          <div 
            ref={progressBarRef}
            className="h-2 bg-gray-700 rounded-full mb-4 cursor-pointer"
            onClick={handleProgressBarClick}
          >
            <div 
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => skip(-10)}
                className="p-1 rounded-full hover:bg-gray-800"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-200"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              
              <button 
                onClick={() => skip(10)}
                className="p-1 rounded-full hover:bg-gray-800"
              >
                <SkipForward className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMute}
                  className="p-1 rounded-full hover:bg-gray-800"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>
            
            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Editing Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trim Tool */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Scissors className="mr-2 h-5 w-5 text-indigo-500" />
            Trim Video
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time: {formatTime(trimStart)}
              </label>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={trimStart}
                onChange={(e) => handleTrimChange('start', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time: {formatTime(trimEnd)}
              </label>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={trimEnd}
                onChange={(e) => handleTrimChange('end', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = trimStart
                  }
                }}
                variant="outline"
                size="sm"
                className="mr-2"
              >
                Preview Start
              </Button>
              <Button 
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = trimEnd
                  }
                }}
                variant="outline"
                size="sm"
              >
                Preview End
              </Button>
            </div>
          </div>
        </div>
        
        {/* AI Enhancements */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
            AI Enhancements
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={aiEnhancements.enhanceAudio}
                onChange={() => toggleAIEnhancement('enhanceAudio')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Enhance Audio Quality</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={aiEnhancements.removeBackground}
                onChange={() => toggleAIEnhancement('removeBackground')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remove Background Noise</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={aiEnhancements.autoCaption}
                onChange={() => toggleAIEnhancement('autoCaption')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-Generate Captions</span>
            </label>
            
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-2">
                AI enhancements may take longer to process
              </p>
            </div>
          </div>
        </div>
        
        {/* Process Video */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Process Video
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Apply your edits and enhancements to create the final video.
            </p>
            
            <div className="pt-2">
              <Button 
                onClick={processVideo}
                isLoading={isProcessing}
                disabled={!ffmpegLoaded || isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : 'Process Video'}
              </Button>
              
              {!ffmpegLoaded && (
                <p className="text-xs text-gray-500 mt-2">
                  Loading video processing tools...
                </p>
              )}
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={downloadVideo}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
