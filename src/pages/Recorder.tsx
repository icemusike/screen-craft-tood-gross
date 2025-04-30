import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Mic, MicOff, Monitor, Video, VideoOff, X, Check, Pause, Play, Square, AlertCircle, Info } from 'lucide-react'
import Button from '../components/ui/Button'
import { useRecordingStore } from '../store/recordingStore'
import { useToast } from '../components/ui/Toaster'

const Recorder = () => {
  const navigate = useNavigate()
  const { addRecording } = useRecordingStore()
  const { addToast } = useToast()
  
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [permissionError, setPermissionError] = useState<string | null>(null)
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
  
  // Check browser support for recording
  useEffect(() => {
    // Check if browser supports screen capture
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setPermissionError('Your browser does not support screen recording. Please use Chrome, Firefox, or Edge.')
    }
  }, [])
  
  // Start recording
  const startRecording = async () => {
    try {
      setPermissionError(null)
      chunksRef.current = []
      
      // Get audio stream if enabled
      let audioStream: MediaStream | null = null
      if (recordingOptions.audio) {
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            } 
          })
        } catch (error) {
          console.error('Audio permission error:', error)
          addToast('Could not access microphone. Recording without audio.', 'warning')
        }
      }
      
      // Get camera stream if enabled
      let videoStream: MediaStream | null = null
      if (recordingOptions.camera) {
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          })
        } catch (error) {
          console.error('Camera permission error:', error)
          addToast('Could not access camera. Recording without video.', 'warning')
          setRecordingOptions(prev => ({ ...prev, camera: false }))
        }
      }
      
      // Get screen stream if enabled
      let screenStream: MediaStream | null = null
      if (recordingOptions.screen) {
        try {
          screenStream = await navigator.mediaDevices.getDisplayMedia({ 
            video: { 
              cursor: 'always',
              displaySurface: 'monitor',
            },
            // Don't request audio here, we'll combine it separately
            audio: false
          })
          
          // Add event listener for when user stops sharing screen
          screenStream.getVideoTracks()[0].addEventListener('ended', () => {
            stopRecording()
            addToast('Screen sharing ended', 'info')
          })
        } catch (error) {
          console.error('Screen permission error:', error)
          setPermissionError('Screen recording permission denied. Please allow screen sharing to record.')
          return
        }
      }
      
      if (!screenStream && !videoStream) {
        setPermissionError('No media sources selected or permissions denied.')
        return
      }
      
      // Combine streams
      let combinedStream = new MediaStream()
      
      // Add screen or camera video tracks
      if (screenStream) {
        screenStream.getVideoTracks().forEach(track => {
          combinedStream.addTrack(track)
        })
      } else if (videoStream) {
        videoStream.getVideoTracks().forEach(track => {
          combinedStream.addTrack(track)
        })
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
        videoRef.current.muted = true // Prevent feedback
      }
      
      // Create media recorder with fallbacks for different browser support
      let mimeType = 'video/webm;codecs=vp9,opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm'
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''
          }
        }
      }
      
      const options = mimeType ? { mimeType } : undefined
      mediaRecorderRef.current = new MediaRecorder(combinedStream, options)
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = () => {
        if (chunksRef.current.length === 0) {
          addToast('No recording data available', 'error')
          return
        }
        
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
        addToast('Recording saved successfully!', 'success')
        
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
      addToast('Recording started', 'info')
    } catch (error) {
      console.error('Error starting recording:', error)
      setPermissionError('Failed to start recording. Please check permissions and try again.')
    }
  }
  
  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        startTimer()
        setIsPaused(false)
        addToast('Recording resumed', 'info')
      } else {
        mediaRecorderRef.current.pause()
        stopTimer()
        setIsPaused(true)
        addToast('Recording paused', 'info')
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
      try {
        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth || 640
        canvas.height = videoRef.current.videoHeight || 360
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
          return canvas.toDataURL('image/jpeg')
        }
      } catch (error) {
        console.error('Error creating thumbnail:', error)
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
    
    // If turning off screen, make sure camera is on
    if (option === 'screen' && recordingOptions.screen) {
      setRecordingOptions(prev => ({
        ...prev,
        screen: false,
        camera: true
      }))
    }
    
    // If turning off camera and screen is off, turn on screen
    if (option === 'camera' && recordingOptions.camera && !recordingOptions.screen) {
      setRecordingOptions(prev => ({
        ...prev,
        camera: false,
        screen: true
      }))
    }
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
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        {/* Video Preview */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 aspect-video flex items-center justify-center">
          {isRecording ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-8">
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm">
                <Monitor className="h-16 w-16 mx-auto text-indigo-400 mb-4" />
                <h3 className="text-xl font-medium text-white">Ready to Record</h3>
                <p className="text-gray-300 mt-2 max-w-md mx-auto">
                  Configure your options below and click Start Recording
                </p>
              </div>
            </div>
          )}
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center bg-black bg-opacity-70 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className={`h-3 w-3 rounded-full mr-3 ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
              <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
          )}
          
          {/* Permission error */}
          {permissionError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-white p-6 rounded-lg max-w-md text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Permission Error</h3>
                <p className="text-gray-600 mb-4">{permissionError}</p>
                <Button 
                  onClick={() => setPermissionError(null)}
                  variant="outline"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="p-8">
          <div className="flex flex-col space-y-8">
            {/* Recording Options */}
            {!isRecording && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recording Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => toggleOption('screen')}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                      recordingOptions.screen 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md' 
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Monitor className="h-10 w-10 mb-3" />
                    <span className="text-sm font-medium">Screen</span>
                    {recordingOptions.screen && (
                      <Check className="h-5 w-5 text-indigo-600 mt-3" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => toggleOption('audio')}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                      recordingOptions.audio 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md' 
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {recordingOptions.audio ? (
                      <Mic className="h-10 w-10 mb-3" />
                    ) : (
                      <MicOff className="h-10 w-10 mb-3" />
                    )}
                    <span className="text-sm font-medium">Audio</span>
                    {recordingOptions.audio && (
                      <Check className="h-5 w-5 text-indigo-600 mt-3" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => toggleOption('camera')}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                      recordingOptions.camera 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md' 
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {recordingOptions.camera ? (
                      <Video className="h-10 w-10 mb-3" />
                    ) : (
                      <VideoOff className="h-10 w-10 mb-3" />
                    )}
                    <span className="text-sm font-medium">Camera</span>
                    {recordingOptions.camera && (
                      <Check className="h-5 w-5 text-indigo-600 mt-3" />
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Recording Controls */}
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  size="lg"
                  className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-indigo-600 to-indigo-700"
                  disabled={!recordingOptions.screen && !recordingOptions.camera}
                >
                  <Camera className="mr-3 h-6 w-6" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={pauseRecording}
                    variant="outline"
                    size="lg"
                    className="px-6 py-3 border-2"
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
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
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
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-3">Tips for professional recordings</h3>
              <ul className="text-blue-700 space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Close unnecessary applications and browser tabs before recording</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Use a good microphone for better audio quality and speak clearly</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Ensure good lighting if using camera and position yourself properly</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>After recording, you can edit and enhance your video with our AI tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>For longer recordings, consider breaking content into smaller segments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recorder
