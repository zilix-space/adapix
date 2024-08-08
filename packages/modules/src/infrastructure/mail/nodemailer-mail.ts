import { createTransport } from 'nodemailer'
import { IMailProvider, SendMailParams } from '../../interfaces/providers/mail'

export class NodeMailerMailProvider implements IMailProvider {
  private transporter

  constructor() {
    this.transporter = createTransport(process.env.SMTP_EMAIL_SERVER)
  }

  async send({ from, to, subject, body }: SendMailParams): Promise<void> {
    await this.transporter.sendMail({
      from,
      to,
      subject,
      html: body,
    })
  }
}
