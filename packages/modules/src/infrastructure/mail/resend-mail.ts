import { Resend } from 'resend'
import { IMailProvider, SendMailParams } from '../../interfaces/providers/mail'

export class ResendProvider implements IMailProvider {
  client: Resend

  constructor() {
    this.client = new Resend(process.env.RESEND_API_KEY)
  }

  async send(params: SendMailParams): Promise<void> {
    await this.client.emails.create({
      to: params.to,
      from: params.from,
      subject: params.subject,
      html: params.body,
    })
  }
}
