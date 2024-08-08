import { cookies } from 'next/headers'

export type UTMParams = {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
}

export function getUTMSFromSSR(): UTMParams {
  return {
    utm_campaign: cookies().get('utm_campaign')?.value,
    utm_source: cookies().get('utm_source')?.value,
    utm_medium: cookies().get('utm_medium')?.value,
    utm_term: cookies().get('utm_term')?.value,
    utm_content: cookies().get('utm_content')?.value,
  }
}
