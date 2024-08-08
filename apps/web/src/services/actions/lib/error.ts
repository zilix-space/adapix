export class ActionError extends Error {
  public errors: any

  constructor(type: string, message: string, errors: any) {
    super(message)

    this.name = type
    this.message = message
    this.errors = errors

    Object.setPrototypeOf(this, ActionError.prototype)
  }
}
