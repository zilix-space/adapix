export const APP_CONFIGS = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http//localhost:3000',
    name: 'AdaPix',
    theme: 'light',
    defaultLanguage: 'pt-BR',
    description: 'Sua ADA na Wallet em Minutos com PIX',
    logo: 'https://cdn.indier.com.br/adapix/adapix.png',
    ogImage: 'https://cdn.indier.com.br/adapix/og-image.png',
    creator: {
      name: 'AdaPix',
      image: 'https://cdn.indier.com.br/adapix/adapix.png',
      twitter: 'https://twitter.com/ada_pix',
    },
    links: {
      site: 'https://adapix.com.br',
      support: 'mailto:suporte@adapix.com.br',
      terms: 'https://help.adapix.com.br/terms',
      privacy: 'https://help.adapix.com.br/privacy',
      docs: 'https://help.adapix.com.br',
      changelog: '/changelog',
      blog: '/blog',
      linkedin: 'https://www.linkedin.com/in/adapix/',
      twitter: 'https://twitter.com/ada_pix',
    },
  },
  providers: {
    analytics: {
      GTM: process.env.NEXT_PUBLIC_GTM,
    },
    mail: {
      resend: {
        from: 'AdaPix <team@indier.co>',
        token: process.env.RESEND_API_KEY,
      },
    },
    auth: {
      providers: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      },
    },
    storage: {
      endpoint: process.env.STORAGE_ENDPOINT,
      region: process.env.STORAGE_REGION,
      bucket: process.env.STORAGE_BUCKET,
      path: process.env.STORAGE_PATH,
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
      signatureVersion: 'v4',
    },
  },
}
