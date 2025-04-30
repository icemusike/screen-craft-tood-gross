import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Clock, Film, Search, SortDesc, Grid, List, Plus, Filter, ChevronDown, Play, Camera } from 'lucide-react'
import { useRecordingStore, Recording } from '../store/recordingStore'
import Button from '../components/ui/Button'
import { useToast } from '../components/ui/Toaster'

const Library = () => {
  const { recordings, deleteRecording } = useRecordingStore()
  const { addToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'duration'>('date')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Filter and sort recordings
  const filteredRecordings = recordings
    .filter(recording => 
      recording.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else {
        return b.duration - a.duration
      }
    })
  
  // Handle delete with confirmation
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteRecording(id)
      addToast(`"${title}" has been deleted`, 'success')
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Recordings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {recordings.length} {recordings.length === 1 ? 'recording' : 'recordings'} available
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/record">
            <Button className="shadow-md bg-gradient-to-r from-indigo-600 to-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              New Recording
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white shadow-md rounded-xl mb-6 overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </button>
              
              {isFilterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">Sort by</div>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'date' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortBy('date')
                        setIsFilterOpen(false)
                      }}
                    >
                      Date (newest first)
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'title' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortBy('title')
                        setIsFilterOpen(false)
                      }}
                    >
                      Title (A-Z)
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'duration' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortBy('duration')
                        setIsFilterOpen(false)
                      }}
                    >
                      Duration (longest first)
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md">
              <button
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Empty state */}
      {recordings.length === 0 && (
        <div className="text-center py-16 bg-white shadow-md rounded-xl border border-gray-100">
          <Film className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No recordings yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Get started by creating your first screen recording. It's easy and takes just a few seconds to set up.
          </p>
          <div className="mt-8">
            <Link to="/record">
              <Button className="shadow-md bg-gradient-to-r from-indigo-600 to-indigo-700">
                <Camera className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Grid view */}
      {viewMode === 'grid' && recordings.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecordings.map((recording) => (
            <div key={recording.id} className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
              <div className="relative aspect-video bg-gray-200 group">
                {recording.thumbnailUrl ? (
                  <img 
                    src={recording.thumbnailUrl} 
                    alt={recording.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
                  {formatDuration(recording.duration)}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <Link 
                    to={`/edit/${recording.id}`}
                    className="p-3 bg-white rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 mx-2"
                  >
                    <Play className="h-6 w-6" />
                  </Link>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {recording.title}
                </h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span>{formatDate(recording.date)}</span>
                </div>
                <div className="mt-4 flex space-x-3">
                  <Link 
                    to={`/edit/${recording.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(recording.id, recording.title)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* List view */}
      {viewMode === 'list' && recordings.length > 0 && (
        <div className="bg-white shadow-md overflow-hidden sm:rounded-xl border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {filteredRecordings.map((recording) => (
              <li key={recording.id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="px-4 py-4 sm:px-6 flex items-center">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0 h-16 w-28 bg-gray-200 rounded-md overflow-hidden relative group">
                      {recording.thumbnailUrl ? (
                        <img 
                          src={recording.thumbnailUrl} 
                          alt={recording.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <Link 
                          to={`/edit/${recording.id}`}
                          className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                        >
                          <Play className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      <div>
                        <Link to={`/edit/${recording.id}`} className="hover:text-indigo-600 transition-colors duration-150">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {recording.title}
                          </p>
                        </Link>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500 mr-6">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{formatDate(recording.date)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Film className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{formatDuration(recording.duration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/edit/${recording.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(recording.id, recording.title)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* No results */}
      {recordings.length > 0 && filteredRecordings.length === 0 && (
        <div className="text-center py-12 bg-white shadow-md rounded-xl border border-gray-100">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No matching recordings</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear search
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Library
