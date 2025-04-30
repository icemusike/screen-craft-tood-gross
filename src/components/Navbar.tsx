import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, Film, Home, Library } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname === path
  }
  
  return (
    <nav className="bg-white shadow-sm">
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
            <button
              type="button"
              className="bg-indigo-600 p-1 rounded-full text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Film className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="grid grid-cols-3 text-center pt-2 pb-3">
          <Link
            to="/"
            className={`flex flex-col items-center px-1 pt-1 text-xs font-medium ${
              isActive('/') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link
            to="/record"
            className={`flex flex-col items-center px-1 pt-1 text-xs font-medium ${
              isActive('/record') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Camera className="h-5 w-5" />
            Record
          </Link>
          <Link
            to="/library"
            className={`flex flex-col items-center px-1 pt-1 text-xs font-medium ${
              isActive('/library') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Library className="h-5 w-5" />
            Library
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
