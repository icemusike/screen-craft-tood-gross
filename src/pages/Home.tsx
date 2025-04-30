import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Edit, Sparkles, Zap, Clock, Scissors } from 'lucide-react'

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Screen Recording</span>
            <span className="block text-indigo-600">Powered by AI</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Record your screen, edit with AI assistance, and share professional videos in minutes.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/record"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Camera className="mr-2 h-5 w-5" />
              Start Recording
            </Link>
            <Link
              to="/library"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="mr-2 h-5 w-5" />
              My Recordings
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Everything you need to create amazing videos
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">High-Quality Recording</h3>
              <p className="mt-2 text-base text-gray-500">
                Capture your screen, webcam, or both in crystal clear quality with flexible resolution options.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">AI-Powered Editing</h3>
              <p className="mt-2 text-base text-gray-500">
                Let AI help you trim dead space, enhance audio, and suggest edits for professional results.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Scissors className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Intuitive Editing Tools</h3>
              <p className="mt-2 text-base text-gray-500">
                Cut, trim, add text overlays, and apply filters with our easy-to-use editing interface.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Instant Processing</h3>
              <p className="mt-2 text-base text-gray-500">
                Process your recordings quickly with our optimized encoding and cloud processing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Auto-Generated Highlights</h3>
              <p className="mt-2 text-base text-gray-500">
                AI identifies key moments in your recordings and creates highlight reels automatically.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                <Edit className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Transcription & Captions</h3>
              <p className="mt-2 text-base text-gray-500">
                Automatically generate accurate transcriptions and add captions to your videos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start recording?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Create professional-quality videos in minutes with our AI-powered tools.
          </p>
          <Link
            to="/record"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Start Recording Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
