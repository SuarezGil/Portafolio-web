import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

const Hero = lazy(() => import('./Hero'))
const About = lazy(() => import('./About'))
const Projects = lazy(() => import('./Projects'))
const Contact = lazy(() => import('./Contact'))

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 dark:text-white relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar />

        <main className="flex-1">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
