import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Edit, Sparkles, Zap, Clock, Scissors, ChevronRight, Play, Shield, Users, Download, Star } from 'lucide-react'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0">
          <svg className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2" width="404" height="784" fill="none" viewBox="0 0 404 784">
            <defs>
              <pattern id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-indigo-500" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                <span className="block">Capture, Edit, Share</span>
                <span className="block text-indigo-300">Powered by AI</span>
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                Create professional-quality screen recordings and videos with our intuitive tools and AI-powered enhancements.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/record"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <Camera className="mr-3 h-5 w-5" />
                  Start Recording
                </Link>
                <Link
                  to="/library"
                  className="inline-flex items-center justify-center px-8 py-4 border border-indigo-300 text-base font-medium rounded-xl shadow-lg text-indigo-100 bg-transparent hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <Play className="mr-3 h-5 w-5" />
                  View Demos
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:ml-8">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1550305080-4e029753abcf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                    alt="Screen recording demo"
                  />
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <svg className="h-20 w-20 text-indigo-500" fill="currentColor" viewBox="0 0 84 84">
                      <circle opacity="0.9" cx="42" cy="42" r="42" fill="white" />
                      <path d="M55 42L35 55V29L55 42Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Everything you need
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Create stunning videos with our comprehensive suite of recording and editing tools
            </p>
          </div>

          <div className="mt-20">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3">
              <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">High-Quality Recording</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Capture your screen, webcam, or both in crystal clear quality with flexible resolution options.
                </dd>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI-Powered Editing</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Let AI help you trim dead space, enhance audio, and suggest edits for professional results.
                </dd>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Scissors className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Intuitive Editing Tools</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Cut, trim, add text overlays, and apply filters with our easy-to-use editing interface.
                </dd>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Zap className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Instant Processing</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Process your recordings quickly with our optimized encoding and cloud processing.
                </dd>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Auto-Generated Highlights</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  AI identifies key moments in your recordings and creates highlight reels automatically.
                </dd>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Edit className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Transcription & Captions</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Automatically generate accurate transcriptions and add captions to your videos.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">How It Works</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Three simple steps to create amazing videos
            </p>
          </div>

          <div className="mt-20">
            <div className="relative">
              {/* Line connecting steps */}
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              
              {/* Steps */}
              <div className="relative flex justify-between">
                {/* Step 1 */}
                <div className="text-center">
                  <span className="relative flex items-center justify-center">
                    <span className="relative z-10 w-12 h-12 flex items-center justify-center bg-white border-2 border-indigo-500 rounded-full">
                      <span className="text-indigo-600 font-bold">1</span>
                    </span>
                  </span>
                  <div className="mt-4 max-w-xs">
                    <h3 className="text-lg font-medium text-gray-900">Record</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Capture your screen, camera, or both with our easy-to-use recording tools.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <span className="relative flex items-center justify-center">
                    <span className="relative z-10 w-12 h-12 flex items-center justify-center bg-white border-2 border-indigo-500 rounded-full">
                      <span className="text-indigo-600 font-bold">2</span>
                    </span>
                  </span>
                  <div className="mt-4 max-w-xs">
                    <h3 className="text-lg font-medium text-gray-900">Edit</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Enhance your video with AI-powered editing tools and professional effects.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <span className="relative flex items-center justify-center">
                    <span className="relative z-10 w-12 h-12 flex items-center justify-center bg-white border-2 border-indigo-500 rounded-full">
                      <span className="text-indigo-600 font-bold">3</span>
                    </span>
                  </span>
                  <div className="mt-4 max-w-xs">
                    <h3 className="text-lg font-medium text-gray-900">Share</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Download your video or share it directly with your audience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Loved by creators everywhere
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Sarah Johnson</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "This tool has completely transformed how I create tutorial videos. The AI editing features save me hours of work!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Michael Chen</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The quality of the recordings is exceptional, and the editing interface is intuitive even for beginners."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Emily Rodriguez</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I use this for creating product demos and training videos. The auto-captioning feature is a game-changer for accessibility."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to create amazing videos?</span>
            <span className="block text-indigo-200">Start recording in seconds.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of creators who use our platform to make professional-quality videos with AI-powered tools.
          </p>
          <Link
            to="/record"
            className="mt-8 w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-all duration-200 shadow-lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            Start Recording Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
