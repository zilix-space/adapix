export function fetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, options).then((res: Response) => res.json())
}
