import nodemailer from 'nodemailer'

const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS']
const missing = requiredVars.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.warn(
    `[mailer] Faltan variables de entorno: ${missing.join(', ')}. ` +
      'El envío de correos fallará hasta que se configuren (ver .env.example).'
  )
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER
