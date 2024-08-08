import { HttpResponseError } from './errors'
import { ApiHandlerContext, ApiMiddleware } from './lib'
import { db } from '@app/db'
import type { UserSettings } from '@app/modules/src/domain/entities/User'

type Auth = {
  user: {
    id: string
    status: string
    name: string
    email: string

    contact: {
      phone: string
      telegram: string
    }

    kyc: {
      status: string
      statusReason: string
    }

    payment: {
      wallet: string
      pix: string
    }

    createdAt: string
  }
}

/**
 * Middleware that adds a user to the context.
 *
 * This middleware checks the 'x-sender-channel' header to extract the user's phone number.
 * It then queries the database to find the user associated with that phone number.
 * If the user is not found or the user is not active or approved, it throws an HttpResponseError.
 *
 * @param req - The incoming request object.
 * @param context - The context object that will be passed to the API handler.
 * @throws HttpResponseError - If the user is not found, not active, or not approved.
 */
export const userAuthMiddleware: ApiMiddleware<
  ApiHandlerContext<any, any, any, Auth>
> = async (req, context) => {
  const userSenderChannel = req.headers.get('x-sender-channel') as string
  const userPhone = userSenderChannel?.split('@')[0]

  if (!userSenderChannel || !userPhone) {
    throw new HttpResponseError({
      status: 403,
      message:
        'Parece que você não passou o header x-sender-channel com o numero do usuário.',
      data: {
        url: `${process.env.NEXT_PUBLIC_APP_URL}dapp/auth`,
      },
    })
  }

  const user = (await db.user.findFirst({
    where: {
      OR: [
        {
          settings: {
            path: ['contact', 'phone'],
            string_ends_with: userPhone,
          },
        },
        {
          settings: {
            path: ['contact', 'telegram'],
            string_ends_with: userPhone,
          },
        },
      ],
    },
    select: {
      id: true,
      status: true,
      name: true,
      email: true,
      settings: true,
      createdAt: true,
    },
  })) as any as {
    id: string
    name: string
    email: string
    status: string
    settings: UserSettings
    createdAt: string
  }

  console.log({
    userSenderChannel,
    userPhone,
    user,
  })

  if (!user || !user.id) {
    throw new HttpResponseError({
      status: 403,
      message:
        'Parece que este usuário ainda não está cadastrado, peça para ele se cadastrar no link.',
      data: {
        url: `${process.env.NEXT_PUBLIC_APP_URL}dapp/auth`,
      },
    })
  }

  if (user.status !== 'ACTIVE') {
    const messages = {
      pending:
        'A documentação deste usuário ainda não foi enviada. Por favor, peça para ele se cadastrar no link fornecido.',
      rejected:
        'Este usuário não foi aprovado para usar o AdaPix. Ele precisa reenviar a documentação para análise. O motivo está no payload.',
      submitted:
        'A documentação deste usuário está em análise. A aprovação deve ocorrer em até 48 horas.',
    }

    throw new HttpResponseError({
      status: 403,
      message: messages[user.settings.kyc.status as keyof typeof messages],
      data: {
        reason: user.settings.kyc.statusReason,
        url: `${process.env.NEXT_PUBLIC_APP_URL}dapp/auth`,
      },
    })
  }

  context.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,

    kyc: {
      status: user.settings.kyc.status,
      statusReason: user.settings.kyc.statusReason,
    },

    payment: {
      wallet: user.settings.payment.wallet,
      pix: user.settings.payment.pix,
    },

    contact: {
      phone: user.settings.contact.phone,
      telegram: user.settings.contact.telegram,
    },

    createdAt: user.createdAt,
  }
}
