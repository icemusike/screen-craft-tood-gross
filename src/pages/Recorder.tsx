import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Mic, MicOff, Monitor, Video, VideoOff, X, Check, Pause, Play, Square } from 'lucide-react'
import Button from '../components/ui/Button'
import { useRecordingStore } from '../store/recordingStore'

const Recorder = () => {
  const navigate = useNavigate()
  const { addRecording } = useRecordingStore()
  
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingOptions, setRecordingOptions] = useState({
    screen: true,
    audio: true,
    camera: false,
  })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Start timer
  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)
  }
  
  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
  
  // Start recording
  const startRecording = async () => {
    try {
      chunksRef.current = []
      
      const audioStream = recordingOptions.audio 
        ? await navigator.mediaDevices.getUserMedia({ audio: true }) 
        : null
        
      const videoStream = recordingOptions.camera 
        ? await navigator.mediaDevices.getUserMedia({ video: true }) 
        : null
        
      const screenStream = recordingOptions.screen 
        ? await navigator.mediaDevices.getDisplayMedia({ 
            video: { 
              cursor: 'always',
            },
            audio: recordingOptions.audio,
          }) 
        : null
      
      if (!screenStream && !videoStream) {
        throw new Error('No media sources selected')
      }
      
      // Combine streams if needed
      let combinedStream: MediaStream
      
      if (screenStream && videoStream) {
        // For simplicity, we're just using the screen stream
        // In a production app, you'd use a canvas to combine both streams
        combinedStream = screenStream
      } else {
        combinedStream = screenStream || videoStream as MediaStream
      }
      
      // Add audio tracks if available
      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track)
        })
      }
      
      streamRef.current = combinedStream
      
      // Display preview
      if (videoRef.current) {
        videoRef.current.srcObject = combinedStream
        videoRef.current.muted = true
      }
      
      // Create media recorder
      const options = { mimeType: 'video/webm' }
      mediaRecorderRef.current = new MediaRecorder(combinedStream, options)
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        
        // Create a thumbnail from the video
        const thumbnailUrl = createThumbnail()
        
        // Save recording
        const newRecording = {
          id: Date.now().toString(),
          title: `Recording ${new Date().toLocaleString()}`,
          date: new Date().toISOString(),
          duration: recordingTime,
          thumbnailUrl: thumbnailUrl || '',
          videoUrl: url,
          processed: false,
        }
        
        addRecording(newRecording)
        
        // Clean up
        stopTimer()
        setRecordingTime(0)
        setIsRecording(false)
        setIsPaused(false)
        
        // Navigate to editor
        navigate(`/edit/${newRecording.id}`)
      }
      
      // Start recording
      mediaRecorderRef.current.start(1000) // Collect data every second
      setIsRecording(true)
      startTimer()
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Please check permissions.')
    }
  }
  
  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        startTimer()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        stopTimer()
        setIsPaused(true)
      }
    }
  }
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      streamRef.current = null
      
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }
  
  // Create a thumbnail from the video
  const createThumbnail = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        return canvas.toDataURL('image/jpeg')
      }
    }
    return null
  }
  
  // Toggle recording options
  const toggleOption = (option: 'screen' | 'audio' | 'camera') => {
    setRecordingOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Video Preview */}
        <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
          {isRecording ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-8">
              <Monitor className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-white">Ready to Record</h3>
              <p className="text-gray-400 mt-2">
                Configure your options below and click Start Recording
              </p>
            </div>
          )}
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center bg-black bg-opacity-50 px-3 py-1 rounded-full">
              <div className={`h-3 w-3 rounded-full mr-2 ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
              <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Recording Options */}
            {!isRecording && (
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => toggleOption('screen')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                    recordingOptions.screen 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Monitor className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Screen</span>
                  {recordingOptions.screen && (
                    <Check className="h-5 w-5 text-indigo-600 mt-2" />
                  )}
                </button>
                
                <button
                  onClick={() => toggleOption('audio')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                    recordingOptions.audio 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {recordingOptions.audio ? (
                    <Mic className="h-8 w-8 mb-2" />
                  ) : (
                    <MicOff className="h-8 w-8 mb-2" />
                  )}
                  <span className="text-sm font-medium">Audio</span>
                  {recordingOptions.audio && (
                    <Check className="h-5 w-5 text-indigo-600 mt-2" />
                  )}
                </button>
                
                <button
                  onClick={() => toggleOption('camera')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                    recordingOptions.camera 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {recordingOptions.camera ? (
                    <Video className="h-8 w-8 mb-2" />
                  ) : (
                    <VideoOff className="h-8 w-8 mb-2" />
                  )}
                  <span className="text-sm font-medium">Camera</span>
                  {recordingOptions.camera && (
                    <Check className="h-5 w-5 text-indigo-600 mt-2" />
                  )}
                </button>
              </div>
            )}
            
            {/* Recording Controls */}
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  size="lg"
                  disabled={!recordingOptions.screen && !recordingOptions.camera}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={pauseRecording}
                    variant="outline"
                    size="lg"
                  >
                    {isPaused ? (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={stopRecording}
                    variant="danger"
                    size="lg"
                  >
                    <Square className="mr-2 h-5 w-5" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      {!isRecording && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Tips for recording</h3>
          <ul className="text-blue-700 space-y-2">
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Close unnecessary applications before recording</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Use a good microphone for better audio quality</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Ensure good lighting if using camera</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>After recording, you can edit and enhance your video with our AI tools</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Recorder
