'use client';

import Cookies from 'js-cookie';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export type UTMParams = {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
};

export type UTMHookReturn = {
  values: UTMParams
  queryValues: string
}

export function useUTM():UTMHookReturn  {
  const searchParams = useSearchParams();

  function getUTMParams(searchParams: URLSearchParams): UTMParams {
    return {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_term: searchParams.get('utm_term'),
      utm_content: searchParams.get('utm_content'),
    };
  }
  
  function getCookieParams(): UTMParams {
    return {
      utm_source: Cookies.get('utm_source'),
      utm_medium: Cookies.get('utm_medium'),
      utm_campaign: Cookies.get('utm_campaign'),
      utm_term: Cookies.get('utm_term'),
      utm_content: Cookies.get('utm_content'),
    };
  }
  
  function updateCookiesWithUTMParams(utmParams: UTMParams, cookieParams: UTMParams): void {
    Object.keys(utmParams).forEach(key => {
      const paramKey = key as keyof UTMParams;
      const newValue = utmParams[paramKey];
      const oldValue = cookieParams[paramKey];
  
      if (newValue && newValue !== oldValue) {
        Cookies.set(key, newValue, { expires: 30 }); // Set cookie to expire in 30 days
      }
    });
  }



  const utmParams = getUTMParams(searchParams);
  const cookieParams = getCookieParams();

  useEffect(() => {
    updateCookiesWithUTMParams(utmParams, cookieParams);
  }, [utmParams, cookieParams]);

  return {
    values: { ...cookieParams, ...utmParams },
    queryValues: new URLSearchParams(searchParams).toString()
  };
}
