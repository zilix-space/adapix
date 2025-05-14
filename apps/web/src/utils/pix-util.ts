export interface PixKeyResponse {
  error?: string
  data?: {
    financialInstitutionCode?: string
    name?: string
    branch?: string
    account?: string
    accountType?: string
    pixKey?: string
    pixKeyType?: string
  }
}

/**
 * Consults a Pix key using Soffy Pix API.
 *
 * @param pix The Pix key to be consulted
 * @returns Promise with the Pix key data
 */
export async function getPixKeyData(pix: string): Promise<PixKeyResponse> {
  try {
    if (!pix) {
      return { error: 'Chave Pix é obrigatória' }
    }

    // Algoritmo melhorado para extrair a chave Pix de qualquer Pix Copia e Cola (BRCode)
    if (pix.includes('BR.GOV.BCB.PIX')) {
      // Encontrar padrão de chave Pix no formato BR.GOV.BCB.PIX + identificador numérico + chave
      const pixMatch = pix.match(
        /BR\.GOV\.BCB\.PIX\d{4}([^0-9]{1}.*?)(?:\d{4}|$)/,
      )
      if (pixMatch && pixMatch[1]) {
        pix = pixMatch[1]
      } else {
        // Tentativa alternativa para formatos diferentes
        const segments = pix.split('BR.GOV.BCB.PIX')
        if (segments.length > 1) {
          // Extrai o segmento após BR.GOV.BCB.PIX
          const keySegment = segments[1]
          // Procura o primeiro dígito que indica o tamanho da chave
          const keyLengthMatch = keySegment.match(/^(\d{4})/)

          if (keyLengthMatch) {
            const keyLength = parseInt(keyLengthMatch[1])
            // Extrai a chave com o tamanho indicado
            pix = keySegment.substring(4, 4 + keyLength)
          }
        }
      }
    }

    // Remove special characters from CPF/CNPJ
    if (/^\d{11,14}$/.test(pix.replace(/\D/g, ''))) {
      pix = pix.replace(/\D/g, '')
    }

    // Remove special characters from phone
    if (pix.startsWith('+')) {
      pix = pix.replace(/\D/g, '')
    }

    const username = process.env.SOFFY_USERNAME || 'felipebarcelospro@gmail.com'
    const password = process.env.SOFFY_PASSWORD || 'fib5iqi8mx'
    const clientId =
      process.env.SOFFY_CLIENT_ID ||
      '7fa06f3910b467ba5591fc0e85d1176a0594f27cc3c40674fac2bf7610b8712a2e00b8c8664e277b8221d'
    const clientSecret =
      process.env.SOFFY_CLIENT_SECRET ||
      '664e277b8221e7fa06f3910b467ba5591fc0e85d1176ac7d75bd57502fdb724f7f6b78221956d18274f84ab827412bc59a30ddae1b4b9dc2b4547cc035034'

    // Create Basic Auth token
    const basicAuth = btoa(`${username}:${password}`)

    // Create fetch options with SSL/TLS verification disabled
    const response = await fetch('https://app.soffy.com.br/v1/pixOut/chave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
        id: clientId,
        secret: clientSecret,
      },
      body: JSON.stringify({
        chavePix: pix,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.error || 'Falha ao consultar chave Pix',
      }
    }

    return {
      data: {
        financialInstitutionCode: data.ispb,
        name: data.nome,
        branch: data.agencia,
        account: data.conta,
        accountType: data.tipoConta,
        pixKey: data.chavePix,
        pixKeyType: data.tipoChavePix,
      },
    }
  } catch (error) {
    console.error('Erro ao consultar chave Pix:', error)
    return {
      error: 'Erro ao consultar chave Pix',
    }
  }
}
