/**
 * Resend Email Service
 * Servicio para envío de correos electrónicos
 */

import { Resend } from 'resend'

/**
 * Create a Resend client lazily to avoid executing network-related
 * or API-key-dependent logic at module import time (this prevents
 * build-time failures when the secret isn't set).
 */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

/**
 * Enviar correo electrónico
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    const fromEmail = from || process.env.EMAIL_FROM || 'Colegio <onboarding@resend.dev>'

    const client = getResendClient()
    if (!client) {
      console.warn('Resend API key not set; skipping sendEmail (dev/test mode)')
      return null
    }

    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (error) {
      console.error('Error enviando correo:', error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error en sendEmail:', error)
    throw error
  }
}

/**
 * Enviar notificación de contacto al admin
 */
export async function sendContactNotification(
  contactData: {
    name: string
    email: string
    subject: string
    message: string
  },
  toEmails?: string[]
) {
  // Si no se proporcionan emails, usar el email por defecto de las variables de entorno
  const recipients = toEmails && toEmails.length > 0 
    ? toEmails 
    : [process.env.ADMIN_EMAIL || 'admin@colegio.edu']
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f3f4f6;
            padding: 20px;
          }
          .email-wrapper {
            max-width: 650px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white; 
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
          }
          .header .icon {
            font-size: 32px;
          }
          .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
            letter-spacing: 0.5px;
          }
          .content { 
            padding: 32px 24px;
            background: #ffffff;
          }
          .info-card {
            background: #f9fafb;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }
          .field { 
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
          }
          .field:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          .label { 
            font-weight: 700;
            color: #1f2937;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            display: block;
          }
          .value { 
            color: #4b5563;
            font-size: 15px;
            line-height: 1.6;
          }
          .message-box {
            background: white;
            border: 1px solid #e5e7eb;
            padding: 16px;
            border-radius: 8px;
            margin-top: 8px;
          }
          .footer { 
            text-align: center;
            padding: 24px;
            background: #f9fafb;
            color: #6b7280;
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
          }
          .footer strong {
            color: #374151;
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper {
              border-radius: 0;
            }
            .header, .content, .footer {
              padding: 20px 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>
              <span class="icon">📧</span>
              Contacto desde la Web
            </h1>
            <div class="badge">FORMULARIO DE CONTACTO</div>
          </div>
          <div class="content">
            <p style="font-size: 15px; color: #6b7280; margin-bottom: 24px;">
              Has recibido un nuevo mensaje desde el formulario de contacto del sitio web:
            </p>
            
            <div class="info-card">
              <div class="field">
                <span class="label">👤 Remitente</span>
                <div class="value"><strong>${contactData.name}</strong></div>
              </div>
              
              <div class="field">
                <span class="label">📬 Correo Electrónico</span>
                <div class="value">
                  <a href="mailto:${contactData.email}" style="color: #2563eb; text-decoration: none;">
                    ${contactData.email}
                  </a>
                </div>
              </div>
              
              <div class="field">
                <span class="label">📋 Asunto</span>
                <div class="value">${contactData.subject}</div>
              </div>
              
              <div class="field">
                <span class="label">💬 Mensaje</span>
                <div class="message-box">
                  ${contactData.message.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <strong>🏫 Sistema de Contacto Web</strong><br>
            Este correo fue generado automáticamente desde el formulario de contacto de tu sitio web.<br>
            <span style="color: #9ca3af; font-size: 12px;">No responder a este correo. Responde directamente a ${contactData.email}</span>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: recipients,
    subject: `🌐 Contacto Web: ${contactData.subject}`,
    html,
  })
}

/**
 * Enviar correo de bienvenida
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎉 ¡Bienvenido!</h2>
          </div>
          <div class="content">
            <p>Hola <strong>${name}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente en el sistema del colegio.</p>
            <p>Ahora puedes acceder con tu correo electrónico y contraseña.</p>
            <p><strong>Equipo del Colegio</strong></p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Bienvenido al Sistema del Colegio',
    html,
  })
}

/**
 * Enviar confirmación al usuario
 */
export async function sendContactConfirmation(userEmail: string, userName: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✅ Mensaje Recibido</h2>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Hemos recibido tu mensaje y te responderemos a la brevedad.</p>
            <p>Gracias por ponerte en contacto con nosotros.</p>
            <p><strong>Equipo del Colegio</strong></p>
          </div>
          <div class="footer">
            Este es un correo automático, por favor no respondas a este mensaje.
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: userEmail,
    subject: 'Hemos recibido tu mensaje - Colegio',
    html,
  })
}
