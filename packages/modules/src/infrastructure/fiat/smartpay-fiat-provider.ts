import axios, { AxiosInstance } from 'axios'
import crypto from 'crypto'
import qs from 'qs'
import {
  CreateExchangeParams,
  IFiatProvider,
  GetEstimateExchangeParams,
  GetEstimateExchangeResult,
  CreateExchangeResult,
} from '../../interfaces/providers/fiat'

export class SmartPayFiatProvider implements IFiatProvider {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'https://connect.smartpay.com.vc/api/swapix/',
    })
  }

  async getEstimateForExchange(
    params: GetEstimateExchangeParams,
  ): Promise<GetEstimateExchangeResult> {
    const response = await this.api.get('/swapquote', {
      params: {
        currency: 'brl',
        type: params.type,
        conv: 'txusdt',
        profile: 'payment',
        amount: params.amount,
      },
    })

    return {
      priceInFiat: Number(response.data.data.price_brl),
      totalInFiat: Number(response.data.data.total_brl),
      feeInFiat: Number(response.data.data.fee_brl),
      sendInFiat: Number(response.data.data.send_brl),
      sendInCrypto: Number(response.data.data.send_txusdt),
      amountInCrypto: Number(response.data.data.amount_txusdt),
      priceInCrypto: Number(response.data.data.price_txusdt),
      totalInCrypto: Number(response.data.data.total_txusdt),
      timeout: Number(response.data.data.timeout),
    }
  }

  async getExchange(
    id: string,
  ): Promise<{ id: string; status: 'COMPLETED' | 'FAILED' }> {
    const response = await this.api.get(`/opstatus`, {
      params: {
        operation_id: id,
      },
    })

    const statuses: Record<string, 'COMPLETED' | 'FAILED'> = {
      done: 'COMPLETED',
      failed: 'FAILED',
    }

    console.log(response.data, statuses[response.data.data.status])

    return {
      id,
      status: statuses[response.data.data.status],
    }
  }

  async createExchange(
    params: CreateExchangeParams,
  ): Promise<CreateExchangeResult> {
    const EXPIRE_IN_15_MINUTES = 900 // 15 minutes in seconds

    if (params.type === 'buy') {
      const response = await this.sendApi('/swapix/pixlinkverify', {
        chain: 'tron', // chain
        currency: 'txusdt', // currency
        address: params.address, // receiver of coins
        amount: params.amount, // converting number amount to string
        amount_direction: 'in',
        expire: EXPIRE_IN_15_MINUTES,
        v_taxid: params.user.document, // cpf or cnpj of the client
        v_email: params.user.email, // email
        v_phone: params.user.phone.startsWith('+')
          ? params.user.phone
          : `+${params.user.phone}`, // clients phone number, international format
        v_country: params.user.country, // country
        v_zip: params.user.address.zipCode, // zip code
        v_num: params.user.address.number, // house number
        v_add: params.user.address.street, // complement, like apartment
      })

      return {
        id: response.operation.operation_id,
        address: response.emv,
        estimate: {
          priceInFiat: Number(response.operation.rate.price_brl),
          totalInFiat: Number(response.operation.rate.total_brl),
          feeInFiat: Number(response.operation.rate.fee_brl),
          sendInFiat: Number(response.operation.rate.send_brl),
          sendInCrypto: Number(response.operation.rate.send_txusdt),
          amountInCrypto: Number(response.operation.rate.amount_txusdt),
          priceInCrypto: Number(response.operation.rate.price_txusdt),
          totalInCrypto: Number(response.operation.rate.total_txusdt),
          timeout: Number(response.operation.rate.timeout),
        },
      }
    }

    const response = await this.sendApi('/swapix/chainlink', {
      chain: 'tron',
      address: params.address,
      currency: 'txusdt',
      amount: params.amount,
      amount_direction: 'in',
      expire: EXPIRE_IN_15_MINUTES,
    })

    return {
      id: response.operation.operation_id,
      address: response.address,
      estimate: {
        priceInFiat: Number(response.operation.rate.price_brl),
        totalInFiat: Number(response.operation.rate.total_brl),
        feeInFiat: Number(response.operation.rate.fee_brl),
        sendInFiat: Number(response.operation.rate.send_brl),
        sendInCrypto: Number(response.operation.rate.send_txusdt),
        amountInCrypto: Number(response.operation.rate.amount_txusdt),
        priceInCrypto: Number(response.operation.rate.price_txusdt),
        totalInCrypto: Number(response.operation.rate.total_txusdt),
        timeout: Number(response.operation.rate.timeout),
      },
    }
  }

  private async sendApi(path: string, data: any): Promise<any> {
    const user = process.env.SMARTPAY_API_USER as string

    data.api_ts = Math.floor(Date.now() / 1000)
    data.api_user = user

    const signedData = this.signData(data)

    data.api_sig = signedData

    const url = `https://connect.smartpay.com.vc/api${path}`
    const response = await axios.post(url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })

    if (!response.data || response.status !== 200) {
      throw new Error('API call failed')
    }

    console.log(response.data)

    return response.data.data
  }

  private signData(data: any): string {
    const token = process.env.SMARTPAY_API_SECRET as string

    const sortedKeys = Object.keys(data).sort()
    const sortedData = sortedKeys.map((key) => `${key}=${data[key]}`).join('&')
    const hmac = crypto.createHmac('sha256', token)
    return hmac.update(Buffer.from(sortedData, 'utf-8')).digest('hex')
  }
}
