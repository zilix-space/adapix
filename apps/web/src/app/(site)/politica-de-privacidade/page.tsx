import { Metadata } from 'next'
import { AnimatedSection } from '../_components/animated-section'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Política de Privacidade | AdaPix',
    description:
      'Nossa política de privacidade explica como coletamos, usamos e protegemos seus dados na plataforma AdaPix.',
  }
}

export default function PrivacyPolicyPage() {
  return (
    <main>
      <div className="container max-w-screen-sm mx-auto px-4 py-12">
        <AnimatedSection className="border shadow-sm p-8 bg-card rounded-xl">
          <h1 className="text-xl font-bold mb-8">Política de Privacidade</h1>
          <div className="prose prose-lg max-w-none">
            <h2 className="text-lg font-semibold mt-8 mb-4">1. Introdução</h2>

            <p>
              Bem-vindo à Política de Privacidade da AdaPix ("nós", "nosso" ou
              "AdaPix"). Respeitamos sua privacidade e estamos comprometidos em
              proteger seus dados pessoais. Esta política de privacidade
              informará como cuidamos dos seus dados pessoais quando você visita
              nosso site ou utiliza nossa plataforma para comprar e vender ADA
              usando PIX.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              2. Dados que Coletamos
            </h2>
            <p>
              Podemos coletar, usar, armazenar e transferir diferentes tipos de
              dados pessoais sobre você, incluindo:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                Dados de identidade (nome completo, CPF, data de nascimento)
              </li>
              <li>Dados de contato (endereço de e-mail, número de telefone)</li>
              <li>
                Dados financeiros (detalhes da conta bancária para transações
                via PIX)
              </li>
              <li>
                Dados de transação (detalhes sobre pagamentos de e para você)
              </li>
              <li>
                Dados técnicos (endereço IP, dados de login, tipo e versão do
                navegador)
              </li>
              <li>
                Dados de perfil (seu nome de usuário e senha, transações
                realizadas)
              </li>
              <li>
                Dados de uso (informações sobre como você usa nosso site e
                serviços)
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              3. Como Coletamos Seus Dados
            </h2>
            <p>Utilizamos diferentes métodos para coletar dados, incluindo:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                Interações diretas (quando você se cadastra em nossa plataforma
                ou realiza transações)
              </li>
              <li>Tecnologias automatizadas (cookies, logs do servidor)</li>
              <li>
                Verificação KYC (Know Your Customer) para cumprimento de
                exigências regulatórias
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              4. Como Usamos Seus Dados
            </h2>
            <p>Usamos seus dados pessoais para os seguintes fins:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Fornecer nossos serviços de compra e venda de ADA</li>
              <li>Processar transações via PIX</li>
              <li>
                Verificar sua identidade conforme exigido por regulamentações
              </li>
              <li>Gerenciar sua conta e relacionamento conosco</li>
              <li>Notificar sobre alterações em nossos serviços</li>
              <li>Melhorar nosso site e serviços</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Prevenir fraudes e lavagem de dinheiro</li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              5. Compartilhamento de Dados
            </h2>
            <p>Podemos compartilhar seus dados pessoais com:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                Prestadores de serviços (processamento de pagamentos,
                verificação de identidade)
              </li>
              <li>
                Autoridades reguladoras e outras autoridades governamentais
              </li>
              <li>Parceiros comerciais para fornecer serviços solicitados</li>
            </ul>
            <p>
              Todos os terceiros com quem compartilhamos seus dados são
              obrigados a respeitar a segurança dos seus dados pessoais e a
              tratá-los de acordo com a lei.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              6. Segurança de Dados
            </h2>
            <p>
              Implementamos medidas de segurança adequadas para proteger seus
              dados pessoais contra perda, uso ou acesso não autorizados,
              alteração ou divulgação. Limitamos o acesso aos seus dados
              pessoais a funcionários, agentes, contratados e terceiros com
              necessidade comercial legítima.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              7. Retenção de Dados
            </h2>
            <p>
              Mantemos seus dados pessoais apenas pelo tempo necessário para
              cumprir os fins para os quais os coletamos, incluindo para fins de
              cumprimento de requisitos legais, contábeis ou de relatórios.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              8. Seus Direitos Legais
            </h2>
            <p>
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
              direitos em relação aos seus dados pessoais, incluindo:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Direito de acesso aos seus dados pessoais</li>
              <li>Direito de retificação dos seus dados pessoais</li>
              <li>Direito de solicitar a exclusão dos seus dados pessoais</li>
              <li>
                Direito de restringir o processamento dos seus dados pessoais
              </li>
              <li>
                Direito de se opor ao processamento dos seus dados pessoais
              </li>
              <li>Direito à portabilidade dos dados</li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">9. Cookies</h2>
            <p>
              Utilizamos cookies e tecnologias semelhantes para melhorar sua
              experiência em nosso site. Você pode configurar seu navegador para
              recusar todos ou alguns cookies, ou para alertá-lo quando sites
              definem ou acessam cookies.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              10. Alterações na Política de Privacidade
            </h2>
            <p>
              Podemos atualizar nossa política de privacidade periodicamente.
              Quaisquer alterações serão publicadas nesta página com uma data de
              atualização. Recomendamos verificar regularmente esta política
              para estar ciente de quaisquer alterações.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">11. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre esta política de privacidade ou
              nossas práticas de privacidade, entre em contato conosco pelo
              e-mail:{' '}
              <a
                href="mailto:suporte@adapix.com.br"
                className="text-primary underline"
              >
                suporte@adapix.com.br
              </a>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
