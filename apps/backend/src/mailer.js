const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

const requiredVars = ['BREVO_API_KEY', 'MAIL_FROM']
const missing = requiredVars.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.warn(
    `[mailer] Faltan variables de entorno: ${missing.join(', ')}. ` +
      'El envío de correos fallará hasta que se configuren (ver .env.example).'
  )
}

export const MAIL_FROM = process.env.MAIL_FROM
export const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'Portafolio'

export async function sendMail({ to, replyTo, subject, text, html }) {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    signal: AbortSignal.timeout(10_000),
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: MAIL_FROM_NAME, email: MAIL_FROM },
      to: [{ email: to }],
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
      subject,
      textContent: text,
      htmlContent: html,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Brevo API respondió ${response.status}: ${body}`)
  }

  return response.json()
}
