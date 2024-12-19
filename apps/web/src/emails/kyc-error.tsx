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
import { KYCRejectionReason } from '@app/modules/src/domain/entities/User'
/**
 * Email template for KYC rejection notification
 * @param name - User's name
 * @param email - User's email
 * @param reasons - Array of KYC rejection reasons
 */
export default function KycError({
  name = 'Brendon Urie',
  email = 'panic@thedis.co',
  reasons,
}: {
  name: string | null
  email: string
  reasons: KYCRejectionReason[]
}) {
  const REJECTION_REASON_MESSAGES = {
    [KYCRejectionReason.INVALID_SELFIE]:
      'A foto da selfie não atende aos requisitos ou está pouco clara',
    [KYCRejectionReason.INVALID_SELFIE_WITH_DOCUMENT]:
      'A selfie com o documento não está claramente visível ou não atende aos requisitos',
    [KYCRejectionReason.INVALID_DOCUMENT_FRONT]:
      'A frente do documento está pouco clara ou incompleta',
    [KYCRejectionReason.INVALID_DOCUMENT_BACK]:
      'O verso do documento está pouco claro ou incompleto',
    [KYCRejectionReason.INVALID_ADDRESS]:
      'As informações de endereço fornecidas estão incorretas ou incompletas',
    [KYCRejectionReason.INVALID_DATA]:
      'As informações pessoais enviadas contêm erros ou inconsistências',
    [KYCRejectionReason.SUSPICIOUS_DATA]:
      'As informações enviadas mostram sinais de possível fraude ou manipulação',
  }

  return (
    <Html>
      <Head />
      <Preview>Documentos inválidos - {APP_CONFIGS.app.name}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-background font-sans">
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
              Documentos inválidos!
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Olá{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Infelizmente, seus documentos não foram validados pelos seguintes
              motivos:
            </Text>

            {reasons.map((reason, index) => (
              <Text key={index} className="text-sm leading-6 text-black ml-4">
                • {REJECTION_REASON_MESSAGES[reason] || ''}
              </Text>
            ))}

            <Text className="text-sm leading-6 text-black mt-4">
              Por favor, corrija os problemas indicados e envie novamente seus
              documentos.
            </Text>

            <Text className="text-sm leading-6 text-black">
              Se precisar de ajuda ou tiver alguma dúvida, não hesite em nos
              contatar.
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Time do {APP_CONFIGS.app.name}
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
