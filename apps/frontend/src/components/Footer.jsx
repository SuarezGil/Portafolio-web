import { useI18n } from '../context/I18nContext'
import { FiGithub } from 'react-icons/fi'

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-gray-200 dark:border-white/10 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 dark:text-gray-500 text-sm">
        <p>
          &copy; {year} Iosef Suárez Gil. {t('footer.copyright')}.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/SuarezGil"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition"
            aria-label="GitHub"
          >
            <FiGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}
