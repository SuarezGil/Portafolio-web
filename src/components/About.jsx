import Foto from '../assets/yo.jpg'
import cv from '../assets/CURRICULUM IOSEF SUAREZ GIL 2026.pdf'
import { motion } from 'framer-motion'
import { useI18n } from '../context/I18nContext'
import { FiDownload, FiFolder, FiCode, FiCalendar, FiGithub } from 'react-icons/fi'
import {
  SiReact, SiNodedotjs, SiExpress, SiMongodb, SiJavascript,
  SiHtml5, SiCss, SiTailwindcss, SiGit, SiGithub as SiGithubIcon,
} from 'react-icons/si'

const iconMap = {
  React: SiReact,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  CSS: SiCss,
  'Tailwind CSS': SiTailwindcss,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  Git: SiGit,
  GitHub: SiGithubIcon,
}

const colorMap = {
  React: 'text-cyan-400',
  JavaScript: 'text-yellow-400',
  HTML: 'text-orange-400',
  CSS: 'text-blue-400',
  'Tailwind CSS': 'text-cyan-400',
  'Node.js': 'text-green-500',
  Express: 'text-gray-400',
  MongoDB: 'text-green-400',
  Git: 'text-orange-500',
  GitHub: 'text-gray-500 dark:text-gray-300',
}

const categoryColors = {
  frontend: 'border-sky-400',
  backend: 'border-green-400',
  tools: 'border-purple-400',
}

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Tools',
}

function SkillBar({ name, level, category }) {
  const Icon = iconMap[name]
  const color = colorMap[name] || 'text-sky-400'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          {Icon && <Icon className={color} />}
          {name}
        </span>
        <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">{level}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full ${
            category === 'frontend' ? 'bg-sky-400' :
            category === 'backend' ? 'bg-green-400' : 'bg-purple-400'
          }`}
        />
      </div>
    </div>
  )
}

export default function About() {
  const { t } = useI18n()
  const skills = t('about.skills')
  const timeline = t('about.timeline')

  const stats = [
    { icon: FiFolder, value: '5+', label: t('about.stats.projects') },
    { icon: FiCode, value: '10+', label: t('about.stats.technologies') },
    { icon: FiCalendar, value: '3', label: t('about.stats.experience') },
    { icon: FiGithub, value: '30+', label: t('about.stats.commits') },
  ]

  const categories = ['frontend', 'backend', 'tools']

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-28 pb-20 gap-10 relative">
      {/* BIO + PHOTO + STATS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border border-gray-200 dark:border-white/10"
      >
        <div className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-3 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-sky-400 text-4xl md:text-5xl font-bold mb-6"
            >
              {t('about.title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4"
            >
              {t('about.bio1')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-4"
            >
              {t('about.bio2')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-6"
            >
              {t('about.bio3')}
            </motion.p>

            <motion.a
              href={cv}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="inline-flex items-center gap-2 border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-black transition px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              <FiDownload /> {t('about.downloadCv')}
            </motion.a>
          </div>

          <div className="md:col-span-2 flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition duration-500" />
              <img
                src={Foto}
                alt="Iosef Suárez Gil"
                loading="lazy"
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-sky-400 relative shadow-xl group-hover:scale-105 transition duration-500"
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                  className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                >
                  <stat.icon className="text-sky-400 mb-1" size={18} />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* SKILLS WITH PROGRESS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-5xl w-full bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl py-10 px-8 md:px-10 shadow-2xl border border-gray-200 dark:border-white/10"
      >
        <h2 className="text-4xl text-center text-sky-400 font-bold mb-10">
          {t('about.techTitle')}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat} className="space-y-4">
              <h3 className={`text-sm font-semibold uppercase tracking-wider border-l-4 ${categoryColors[cat]} pl-3 text-gray-600 dark:text-gray-400`}>
                {categoryLabels[cat]}
              </h3>
              <div className="space-y-4">
                {Array.isArray(skills) && skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} category={skill.category} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* TIMELINE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-5xl w-full bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl py-10 px-8 md:px-10 shadow-2xl border border-gray-200 dark:border-white/10"
      >
        <h2 className="text-4xl text-center text-sky-400 font-bold mb-10">
          {t('about.timelineTitle')}
        </h2>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10 transform md:-translate-x-1/2" />

          {Array.isArray(timeline) && timeline.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.2 }}
              className={`relative flex items-start gap-6 mb-8 md:mb-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="hidden md:block md:w-1/2" />

              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-sky-400 border-4 border-white dark:border-slate-900 transform -translate-x-1/2 mt-1.5 z-10 shadow" />

              <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                <span className="text-xs font-bold text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full">
                  {event.year}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {event.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
    </div>
  )
}
