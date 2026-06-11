import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Hero from './Hero'
import NavBar from './NavBar'
import { About } from './About'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">

      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full"></div>


      <div className="relative z-10">
        <NavBar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

    </div>
  )
}

export default App
