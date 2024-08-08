export class NodeUUIDProvider {
  static generate(): string {
    return crypto.randomUUID()
  }
}
