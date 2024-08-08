export class HttpResponseError extends Error {
  status: number
  data: any

  constructor(input: { status: number; message: string; data?: any }) {
    super(input.message)
    this.status = input.status
    this.data = input.data
    this.name = 'HttpResponseError'
    Object.setPrototypeOf(this, HttpResponseError.prototype)
  }
}
