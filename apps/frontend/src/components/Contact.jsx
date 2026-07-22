import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../context/I18nContext'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'

export default function Contact() {
  const { t } = useI18n()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 relative">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-sky-400 text-5xl md:text-6xl font-bold mb-4 text-center"
      >
        {t('contact.title')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-gray-500 dark:text-gray-400 text-lg mb-12 text-center"
      >
        {t('contact.subtitle')}
      </motion.p>

      <div className="grid md:grid-cols-2 gap-10 max-w-4xl w-full">
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              {t('contact.form.name')}
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 transition"
              placeholder={t('contact.form.name')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              {t('contact.form.email')}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 transition"
              placeholder={t('contact.form.email')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              {t('contact.form.message')}
            </label>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-sky-400 transition resize-none"
              placeholder={t('contact.form.message')}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex items-center justify-center gap-2 w-full border border-sky-400 text-sky-400 py-3 rounded-xl hover:bg-sky-400 hover:text-black transition disabled:opacity-50 font-medium"
          >
            <FiSend />
            {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
          </button>

          {status === 'success' && (
            <p className="text-green-400 text-sm text-center">{t('contact.form.success')}</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm text-center">{t('contact.form.error')}</p>
          )}
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('contact.info.title')}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <FiMail className="text-sky-400 shrink-0" />
              <span>{t('contact.info.email')}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <FiPhone className="text-sky-400 shrink-0" />
              <span>{t('contact.info.phone')}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <FiMapPin className="text-sky-400 shrink-0" />
              <span>{t('contact.info.location')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
