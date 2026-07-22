import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useI18n } from '../context/I18nContext'
import { FiSun, FiMoon } from 'react-icons/fi'

function NavBar() {
  const { theme, toggleTheme } = useTheme()
  const { t, toggleLang } = useI18n()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 text-gray-900 dark:text-white bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 transition-colors">
        <Link to="/" className="text-lg md:text-xl font-semibold tracking-wider hover:text-sky-400 transition">
          Portafolio 2026
        </Link>

        <ul className="flex items-center gap-4 md:gap-6 text-sm">
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
      </nav>
    </header>
  )
}

export default NavBar
