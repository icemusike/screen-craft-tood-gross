import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/Toaster'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Recorder from './pages/Recorder'
import Editor from './pages/Editor'
import Library from './pages/Library'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/record" element={<Recorder />} />
            <Route path="/edit/:id" element={<Editor />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
