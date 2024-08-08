export interface SendMailParams {
  from: string
  to: string
  subject: string
  body: string
}

export interface IMailProvider {
  send: (params: SendMailParams) => Promise<void>
}
