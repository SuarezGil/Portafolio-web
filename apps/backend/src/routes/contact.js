import { Router } from 'express'
import { transporter, MAIL_FROM } from '../mailer.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OWNER_EMAIL = process.env.OWNER_EMAIL

const router = Router()

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios.' })
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Proporciona un correo electrónico válido.' })
  }

  if (!OWNER_EMAIL) {
    console.error('[contact] Falta configurar OWNER_EMAIL en las variables de entorno.')
    return res.status(500).json({ error: 'El formulario no está disponible por el momento.' })
  }

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
      html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${String(message).replace(/\n/g, '<br/>')}</p>
      `,
    })

    res.status(200).json({ message: 'Mensaje enviado correctamente.' })
  } catch (error) {
    console.error('[contact] Error al enviar el correo:', error)
    res.status(502).json({ error: 'No se pudo enviar el mensaje. Intenta nuevamente más tarde.' })
  }
})

export default router
