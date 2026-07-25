import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useI18n } from '../context/I18nContext'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'

function NavBar() {
  const { theme, toggleTheme } = useTheme()
  const { t, toggleLang } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 text-gray-900 dark:text-white bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 transition-colors">
        <Link to="/" onClick={closeMenu} className="text-lg md:text-xl font-semibold tracking-wider hover:text-sky-400 transition">
          Portafolio 2026
        </Link>

        <ul className="hidden md:flex items-center gap-4 md:gap-6 text-sm">
          <li>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-sky-400 transition duration-300 font-medium">
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <Link to="/projects" className="text-gray-700 dark:text-gray-300 hover:text-sky-400 transition duration-300 font-medium">
              {t('nav.projects')}
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-sky-400 transition duration-300 font-medium">
              {t('nav.contact')}
            </Link>
          </li>

          <li className="flex items-center gap-2 ml-2 border-l border-gray-300/30 dark:border-white/10 pl-4">
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-400 hover:text-sky-400 transition"
              aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <button
              onClick={toggleLang}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-sky-400 transition px-2 py-1 border border-gray-400/30 dark:border-gray-500/30 rounded"
            >
              {t('lang.switch')}
            </button>
          </li>
        </ul>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden text-gray-700 dark:text-gray-300 hover:text-sky-400 transition"
          aria-label={menuOpen ? t('nav.close') : t('nav.menu')}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-1 px-6 py-4 text-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10">
          <li>
            <Link to="/about" onClick={closeMenu} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-sky-400 transition font-medium">
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <Link to="/projects" onClick={closeMenu} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-sky-400 transition font-medium">
              {t('nav.projects')}
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMenu} className="block py-2 text-gray-700 dark:text-gray-300 hover:text-sky-400 transition font-medium">
              {t('nav.contact')}
            </Link>
          </li>
          <li className="flex items-center gap-3 pt-3 mt-2 border-t border-gray-200/20 dark:border-white/10">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-400 transition"
              aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              {theme === 'dark' ? t('theme.light') : t('theme.dark')}
            </button>

            <button
              onClick={toggleLang}
              className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-sky-400 transition px-2 py-1 border border-gray-400/30 dark:border-gray-500/30 rounded"
            >
              {t('lang.switch')}
            </button>
          </li>
        </ul>
      )}
    </header>
  )
}

export default NavBar
