export class SlugValueObject {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  static createFromText(text: string, addRandomByte = true): string {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_-]/g, '') // Inclua o hífen na lista de caracteres permitidos
      .replace(/\s+/g, '-') // espaços substituídos por hífen
      .replace(/_+/g, '-') // sublinhados substituídos por hífen
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')

    if (!addRandomByte) return slugText

    const randomByDate = new Date().getTime().toString(36)
    return `${slugText}-${randomByDate}`
  }

  static createFromEmail(email: string): string {
    const username = email.split('@')[0]
    return SlugValueObject.createFromText(username)
  }
}
