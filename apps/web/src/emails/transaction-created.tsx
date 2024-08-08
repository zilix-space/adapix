import Footer from './components/footer'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { APP_CONFIGS } from '../boilerplate.config'
import { Transaction } from '@app/modules/src/domain/entities/Transaction'
import { formatCurrency } from '@/helpers/format-currency'

export default function TransactionStarted({
  name = 'Brendon Urie',
  email = 'panic@thedis.co',
  transaction,
}: {
  name: string | null
  email: string
  transaction: Transaction
}) {
  return (
    <Html>
      <Head />
      <Preview>Transação Iniciada - {APP_CONFIGS.app.name}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded-md border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8 text-left">
              <Img
                src={APP_CONFIGS.app.logo}
                height="40"
                alt={APP_CONFIGS.app.name}
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-left text-xl font-semibold text-black">
              Transação Iniciada - {APP_CONFIGS.app.name}
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Olá{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Sua transação foi iniciada com sucesso. Aqui estão os detalhes da
              transação:
            </Text>
            <Text className="text-sm leading-6 text-black">
              <strong>ID da Transação:</strong> {transaction.id}
            </Text>
            <Text className="text-sm leading-6 text-black">
              <strong>Status:</strong> {transaction.status}
            </Text>
            <Text className="text-sm leading-6 text-black">
              <strong>Tipo:</strong> {transaction.type}
            </Text>
            <Text className="text-sm leading-6 text-black">
              <strong>Quantia de:</strong>{' '}
              {formatCurrency(transaction.fromAmount, transaction.fromCurrency)}
            </Text>
            <Text className="text-sm leading-6 text-black">
              <strong>Quantia para:</strong>{' '}
              {formatCurrency(transaction.toAmount, transaction.toCurrency)}
            </Text>
            <Text className="text-sm leading-6 text-black">
              <strong>Endereço de Recebimento:</strong>{' '}
              {transaction.addressToReceive}
            </Text>
            <Text className="text-sm leading-6 text-black">
              <strong>Data de Criação:</strong>{' '}
              {transaction.createdAt.toLocaleString()}
            </Text>
            {transaction.expiresAt && (
              <Text className="text-sm leading-6 text-black">
                <strong>Data de Expiração:</strong>{' '}
                {transaction.expiresAt.toLocaleString()}
              </Text>
            )}
            <Text className="text-sm leading-6 text-black">
              Se você tiver alguma dúvida ou precisar de ajuda, não hesite em
              nos contatar.
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Time do {APP_CONFIGS.app.name}
            </Text>

            <Footer email={email} marketing={false} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
