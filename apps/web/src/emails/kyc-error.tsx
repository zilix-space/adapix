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

export default function KycError({
  name = 'Brendon Urie',
  email = 'panic@thedis.co',
}: {
  name: string | null
  email: string
}) {
  return (
    <Html>
      <Head />
      <Preview>Documentos inválidos - {APP_CONFIGS.app.name}</Preview>
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
              Documentos inválidos!
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Olá{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Infelizmente, seus documentos não foram validados. Por favor,
              envie novamente as fotos do documento e uma selfie segurando o
              documento perto do rosto.
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
