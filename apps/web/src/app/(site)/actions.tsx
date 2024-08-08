import { client } from '@/services/actions/public-client'
import { modules } from '@app/modules/src'
import { cache } from 'react'

export const getAdaQuoteAction = cache(
  client.action({
    name: 'ada.get-quote',
    type: 'query',
    handler: async () => {
      const adaPrice = await modules.provider.market.getQuote('cardano', 'brl')

      return {
        quote: adaPrice,
      }
    },
  }),
)
