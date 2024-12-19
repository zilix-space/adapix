import { APP_CONFIGS } from '@/boilerplate.config'
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
import Footer from './components/footer'

export default function LoginLink({
  email = 'panic@thedis.co',
  url = 'http://localhost:8888/api/auth/callback/email?callbackUrl=http%3A%2F%2Fapp.localhost%3A3000%2Flogin&token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&email=youremail@gmail.com',
}: {
  email: string
  url: string
}) {
  return (
    <Html>
      <Head />
      <Preview>Seu link de login {APP_CONFIGS.app.name}</Preview>
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
              Seu link de login
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Bem-vindo ao {APP_CONFIGS.app.name}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Por favor, clique no link mágico abaixo para acessar sua conta.
            </Text>
            <Section className="my-8 text-left">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Entrar
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              ou copie e cole esta URL no seu navegador:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">
              {url.replace(/^https?:\/\//, '')}
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
