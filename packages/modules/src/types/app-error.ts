export class AppError extends Error {
  public readonly data?: any

  constructor(message: string, data?: any) {
    super(message)
    this.name = 'AppError'
    this.data = data
    Error.captureStackTrace(this, this.constructor)
  }
}
