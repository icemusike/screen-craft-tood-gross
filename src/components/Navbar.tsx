import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, Film, Home, Library, Menu, X } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => {
    return location.pathname === path
  }
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Camera className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">ScreenCraft AI</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
              <Link
                to="/record"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/record') 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Camera className="mr-1 h-4 w-4" />
                Record
              </Link>
              <Link
                to="/library"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/library') 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Library className="mr-1 h-4 w-4" />
                Library
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              to="/record"
              className="bg-indigo-600 p-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <Film className="h-5 w-5" />
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/') 
                ? 'border-indigo-500 text-indigo-700 bg-indigo-50' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <Home className="mr-3 h-5 w-5" />
              Home
            </div>
          </Link>
          <Link
            to="/record"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/record') 
                ? 'border-indigo-500 text-indigo-700 bg-indigo-50' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <Camera className="mr-3 h-5 w-5" />
              Record
            </div>
          </Link>
          <Link
            to="/library"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/library') 
                ? 'border-indigo-500 text-indigo-700 bg-indigo-50' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center">
              <Library className="mr-3 h-5 w-5" />
              Library
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
