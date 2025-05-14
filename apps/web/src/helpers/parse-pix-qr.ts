/**
 * Parse a PIX QR Code string and extract its data
 * The QR code follows the EMV standard format
 *
 * @param qrString The string content from a PIX QR code
 * @returns Object containing the parsed PIX information
 */
export interface PixQRData {
  value?: number
  recipient?: string
  name?: string
  city?: string
  description?: string
  key?: string
  txid?: string
  raw: string
}

export function parsePixQR(qrString: string): PixQRData | null {
  // If not a PIX QR Code or invalid format, return null
  if (!qrString || typeof qrString !== 'string') {
    return null
  }

  try {
    // Check if it's likely a PIX QR code
    if (!qrString.includes('BR.GOV.BCB.PIX')) {
      console.log('Não é um QR Code PIX - falta identificador BR.GOV.BCB.PIX')
      return null
    }

    console.log('QR Code PIX detectado, iniciando parse...')
    const pixData: PixQRData = { raw: qrString }

    // Define a helper function to extract data by ID
    const extract = (id: string, data: string): string | null => {
      try {
        // Regex mais preciso para extrair os dados do QR code PIX
        // Busca o ID seguido de dois dígitos (comprimento) e captura o valor de acordo com o comprimento indicado
        const regex = new RegExp(`${id}(\\d{2})([\\w\\W]{1,99})`, 'g')
        const match = regex.exec(data)

        if (match && match.length >= 3) {
          const length = parseInt(match[1], 10)
          const extracted = match[2].substring(0, length)
          console.log(
            `Extraído [${id}]: comprimento=${length}, valor="${extracted}"`,
          )
          return extracted
        }
        console.log(`Não encontrado ID ${id} no QR code`)
        return null
      } catch (error) {
        console.error(`Erro ao extrair ID ${id}:`, error)
        return null
      }
    }

    // Extract value (ID: 54)
    // No padrão EMV, o valor está no ID 54, mas pode ter outros formatos
    let valueStr = extract('54', qrString)
    console.log('Valor extraído bruto:', valueStr)

    if (valueStr) {
      // Limpar o valor para extrair apenas o número
      valueStr = valueStr.replace(/[^0-9.,]/g, '')

      // Se houver vírgula, substituir por ponto (padrão decimal)
      const value = parseFloat(valueStr.replace(',', '.'))

      if (!isNaN(value)) {
        console.log('Valor em número:', value)
        pixData.value = value
      }
    } else {
      // Tentar extrair valor de outra forma, pois alguns QR codes usam outro formato
      const transactionValue = qrString.match(/5204(\d{4})5303/)
      if (transactionValue && transactionValue.length > 1) {
        const value = parseInt(transactionValue[1]) / 100 // Converte centavos para reais
        if (!isNaN(value)) {
          console.log('Valor alternativo encontrado:', value)
          pixData.value = value
        }
      }
    }

    // Extract name (ID: 59)
    const name = extract('59', qrString)
    if (name) {
      pixData.name = name
    }

    // Extract city (ID: 60)
    const city = extract('60', qrString)
    if (city) {
      pixData.city = city
    }

    // Extract description/message (ID: 62)
    const description = extract('62', qrString)
    if (description) {
      pixData.description = description
    }

    // Extract PIX key (ID: 26)
    const pixInfo = extract('26', qrString)
    if (pixInfo) {
      const key = extract('01', pixInfo)
      if (key) {
        pixData.key = key
      }

      const txid = extract('05', pixInfo)
      if (txid) {
        pixData.txid = txid
      }
    }

    // Extract recipient name from another location if available
    const recipientInfo = extract('52', qrString)
    if (recipientInfo) {
      pixData.recipient = recipientInfo
    }

    // Tratamento especial para QR codes do tipo EMV (padrão PIX) que não foram processados corretamente
    if (
      Object.keys(pixData).length <= 1 &&
      qrString.includes('BR.GOV.BCB.PIX')
    ) {
      console.log('Tentando processamento alternativo do QR Code PIX...')

      // Tenta extrair o nome (ID 59)
      const nameMatch = qrString.match(/59(\d{2})([^0-9]{2,})/)
      if (nameMatch && nameMatch.length > 2) {
        const nameLength = parseInt(nameMatch[1], 10)
        pixData.name = nameMatch[2].substring(0, nameLength)
        console.log('Nome alternativo encontrado:', pixData.name)
      }

      // Tenta extrair a cidade (ID 60)
      const cityMatch = qrString.match(/60(\d{2})([^0-9]{2,})/)
      if (cityMatch && cityMatch.length > 2) {
        const cityLength = parseInt(cityMatch[1], 10)
        pixData.city = cityMatch[2].substring(0, cityLength)
        console.log('Cidade alternativa encontrada:', pixData.city)
      }

      // Tenta extrair o valor
      if (!pixData.value) {
        const amountMatch = qrString.match(/5204(\d{4})5303/)
        if (amountMatch && amountMatch.length > 1) {
          pixData.value = parseInt(amountMatch[1]) / 100
          console.log('Valor alternativo encontrado:', pixData.value)
        }
      }

      // Se ainda não temos o valor, podemos tentar extrair de outra forma
      if (!pixData.value) {
        const valueStr = qrString.match(/54(\d{2})(\d+(\.\d+)?)/)
        if (valueStr && valueStr.length > 2) {
          pixData.value = parseFloat(valueStr[2])
          console.log('Valor alternativo 2 encontrado:', pixData.value)
        }
      }
    }

    // Extrair informações da chave PIX
    const pixKeyStartIndex = qrString.indexOf('BR.GOV.BCB.PIX')
    if (pixKeyStartIndex > -1) {
      const keyPart = qrString.substring(pixKeyStartIndex)
      const keyLengthMatch = keyPart.match(/BR\.GOV\.BCB\.PIX(\d{2})([^\d]+)/)
      if (keyLengthMatch && keyLengthMatch.length > 2) {
        const keyLength = parseInt(keyLengthMatch[1], 10)
        pixData.key = keyLengthMatch[2].substring(0, keyLength)
        console.log('Chave PIX encontrada:', pixData.key)
      }
    }

    // Debug final
    console.log('Dados PIX finais:', pixData)

    // Se temos ao menos algum dado além do raw, retornamos o objeto
    if (Object.keys(pixData).length > 1) {
      // > 1 porque raw está sempre presente
      return pixData
    }

    // Se chegamos aqui é porque, mesmo sendo um QR PIX, não conseguimos extrair dados
    // Neste caso, tentamos uma última abordagem - forçar reconhecimento com algumas informações
    if (qrString.includes('BR.GOV.BCB.PIX')) {
      console.log('Forçando reconhecimento do QR Code PIX')

      // Se for um QR PIX, vamos pelo menos retornar que é um código válido com as informações que temos
      if (!pixData.key && qrString.indexOf('+55') > -1) {
        // Tenta extrair telefone como chave
        const phoneMatch = qrString.match(/\+55(\d+)/)
        if (phoneMatch && phoneMatch.length > 1) {
          pixData.key = '+55' + phoneMatch[1]
          console.log('Telefone encontrado como chave:', pixData.key)
        }
      }

      return pixData
    }

    return null
  } catch (error) {
    console.error('Error parsing PIX QR Code:', error)
    return null
  }
}
