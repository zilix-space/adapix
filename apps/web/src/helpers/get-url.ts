import { APP_CONFIGS } from '../boilerplate.config'

export function getUrl(path?: string) {
  const baseUrl = APP_CONFIGS.app.url

  if (path && !path.startsWith('/')) {
    path = `/${path}`
  }

  return `${baseUrl}${path || ''}`
}
