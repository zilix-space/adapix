import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { APP_CONFIGS } from '../boilerplate.config'
import { getUrl } from '../helpers/get-url'
import Footer from './components/footer'

export default function WelcomeEmail({
  name = 'Brendon Urie',
  email = 'panic@thedis.co',
}: {
  name: string | null
  email: string
}) {
  return (
    <Html>
      <Head />
      <Preview>Bem-vindo ao {APP_CONFIGS.app.name}</Preview>
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
              Bem-vindo ao {APP_CONFIGS.app.name}
            </Heading>
            <Section className="my-8">
              <Img
                src={APP_CONFIGS.app.ogImage}
                alt={APP_CONFIGS.app.name}
                className="max-w-[500px]"
              />
            </Section>
            <Text className="text-sm leading-6 text-black">
              Obrigado por se inscrever{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Meu nome é {APP_CONFIGS.app.creator.name}, e eu sou o fundador do{' '}
              {APP_CONFIGS.app.name} - {APP_CONFIGS.app.description}. Estou
              animado por ter você a bordo!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Aqui estão algumas coisas que você pode fazer:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Complete o{' '}
              <Link
                href={getUrl('/')}
                className="font-medium text-blue-600 no-underline"
              >
                seu cadastro
              </Link>
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Siga-nos no{' '}
              <Link
                href={APP_CONFIGS.app.links.twitter}
                className="font-medium text-blue-600 no-underline"
              >
                Twitter
              </Link>
            </Text>
            <Text className="text-sm leading-6 text-black">
              Deixe-me saber se você tiver alguma dúvida ou feedback. Estou
              sempre feliz em ajudar!
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
