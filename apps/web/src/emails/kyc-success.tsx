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

export default function KycSuccess({
  name = 'Brendon Urie',
  email = 'panic@thedis.co',
}: {
  name: string | null
  email: string
}) {
  return (
    <Html>
      <Head />
      <Preview>
        Documentos validados com sucesso - {APP_CONFIGS.app.name}
      </Preview>
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
              Documentos validados com sucesso!
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Olá{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Seus documentos foram validados com sucesso e agora você está
              liberado para conectar sua wallet e fazer transações no{' '}
              {APP_CONFIGS.app.name}.
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
