import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useI18n } from '../context/I18nContext'
import { useNavigate } from 'react-router-dom'
import { FiGithub, FiDownload, FiChevronDown, FiExternalLink } from 'react-icons/fi'
import cv from '../assets/CURRICULUM IOSEF SUAREZ GIL 2026.pdf'

function TypeWriter({ words, className }) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx] || ''
    let timeout

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx + 1))
        setCharIdx(c => c + 1)
      }, 80)
    } else if (!deleting && charIdx >= current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx - 1))
        setCharIdx(c => c - 1)
      }, 40)
    } else if (deleting && charIdx <= 0) {
      timeout = setTimeout(() => {
        setDeleting(false)
        setWordIdx(i => (i + 1) % words.length)
      }, 40)
    }

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words])

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse text-sky-400">|</span>
    </span>
  )
}

function Hero() {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 dark:bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/20 dark:bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />

      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-sky-400 text-5xl md:text-6xl font-bold"
        >
          {t('hero.greeting')} <span className="text-sky-400">{t('hero.name')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-500 dark:text-gray-300 mt-4 h-10"
        >
          <TypeWriter words={t('hero.roles')} className="text-gray-500 dark:text-gray-300" />
        </motion.p>

        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <motion.a
            href={cv}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-2 bg-sky-400 text-black hover:bg-sky-300 shadow-lg shadow-sky-400/25 transition px-6 py-2.5 rounded-lg font-medium"
          >
            <FiDownload size={16} /> {t('hero.cv')}
          </motion.a>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex items-center gap-2 border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black transition px-6 py-2.5 rounded-lg font-medium"
            onClick={() => navigate('/projects')}
          >
            <FiExternalLink size={16} /> {t('nav.projects')}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          <a href="https://github.com/SuarezGil" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-400 transition">
            <FiGithub size={20} />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ duration: 1.5, delay: 2, repeat: Infinity, repeatDelay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500"
      >
        <FiChevronDown size={24} />
      </motion.div>

      
    </section>
  )
}

export default Hero
