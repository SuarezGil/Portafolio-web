import { motion } from 'framer-motion'
import { useI18n } from '../context/I18nContext'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Projects() {
  const { t } = useI18n()
  const projects = t('projects.items')

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 relative">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-sky-400 text-5xl md:text-6xl font-bold mb-14 text-center"
      >
        {t('projects.title')}
      </motion.h1>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full"
      >
        {Array.isArray(projects) && projects.map((proj, i) => (
          <motion.div
            key={i}
            variants={item}
            className="bg-gray-50 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 group"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-sky-400 transition-colors">
              {proj.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5">
              {proj.desc}
            </p>
            <div className="flex gap-4">
              <a
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition"
              >
                <FiExternalLink /> {t('projects.viewProject')}
              </a>
              <a
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                <FiGithub /> {t('projects.viewCode')}
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
