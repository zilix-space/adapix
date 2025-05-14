import { Metadata } from 'next'
import { AnimatedSection } from '../_components/animated-section'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Termos de Uso | AdaPix',
    description:
      'Nossos termos de uso estabelecem as regras e condições para utilização da plataforma AdaPix.',
  }
}

export default function TermsOfUsePage() {
  return (
    <main>
      <div className="container max-w-screen-sm mx-auto px-4 py-12">
        <AnimatedSection className="border shadow-sm p-8 bg-card rounded-xl">
          <h1 className="text-xl font-bold mb-8">Termos de Uso</h1>
          <div className="prose prose-lg max-w-none">
            <h2 className="text-lg font-semibold mt-8 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p>
              Bem-vindo à AdaPix. Estes Termos de Uso regem seu acesso e uso da
              plataforma AdaPix, incluindo quaisquer conteúdos, funcionalidades
              e serviços oferecidos em ou através do site adapix.com.br.
            </p>
            <p>
              Ao acessar ou utilizar nossa plataforma, você concorda em ficar
              vinculado a estes Termos de Uso. Se você não concordar com
              qualquer parte destes termos, não poderá acessar ou utilizar
              nossos serviços.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">2. Definições</h2>
            <ul className="list-disc pl-6 mt-2">
              <li>"AdaPix", "nós", "nosso" se refere à plataforma AdaPix.</li>
              <li>
                "Usuário", "você", "seu" se refere a qualquer pessoa que acesse
                ou utilize a plataforma AdaPix.
              </li>
              <li>
                "ADA" se refere à criptomoeda nativa da blockchain Cardano.
              </li>
              <li>
                "PIX" se refere ao sistema de pagamentos instantâneos criado
                pelo Banco Central do Brasil.
              </li>
              <li>
                "Plataforma" se refere ao site e serviços oferecidos pela
                AdaPix.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              3. Elegibilidade
            </h2>
            <p>Para utilizar os serviços da AdaPix, você deve:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Possuir CPF válido no Brasil</li>
              <li>Ter capacidade jurídica para celebrar contratos</li>
              <li>
                Não ter sido previamente suspenso ou removido da plataforma
              </li>
              <li>
                Cumprir com todas as leis aplicáveis ao usar nossos serviços
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              4. Cadastro e Conta
            </h2>
            <p>
              Para acessar certas funcionalidades da plataforma, você precisará
              criar uma conta fornecendo informações precisas e completas. Você
              é responsável por manter a confidencialidade de sua senha e por
              todas as atividades que ocorrem em sua conta.
            </p>
            <p>
              Você concorda em notificar-nos imediatamente sobre qualquer uso
              não autorizado de sua conta ou qualquer outra violação de
              segurança.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              5. Serviços Oferecidos
            </h2>
            <p>
              A AdaPix oferece uma plataforma para compra e venda de ADA
              (Cardano) utilizando o sistema PIX para transações financeiras em
              Reais (BRL). Nosso serviço inclui:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Compra de ADA usando PIX</li>
              <li>Venda de ADA e recebimento via PIX</li>
              <li>Carteira para armazenamento de ADA</li>
              <li>Histórico de transações</li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              6. Transações e Taxas
            </h2>
            <p>
              Ao utilizar nossos serviços, você concorda com as seguintes
              condições:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Todas as transações são finais e irreversíveis</li>
              <li>
                Taxas de serviço serão aplicadas conforme indicado na plataforma
                no momento da transação
              </li>
              <li>
                O preço de compra e venda de ADA é determinado pela oferta e
                demanda do mercado
              </li>
              <li>Podem existir limites mínimos e máximos para transações</li>
              <li>
                Transações podem estar sujeitas a atrasos devido a confirmações
                na blockchain
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              7. KYC e Verificação
            </h2>
            <p>
              Para cumprir com as regulamentações vigentes, realizamos
              procedimentos de Conheça Seu Cliente (KYC). Você concorda em
              fornecer informações e documentos precisos para verificação de
              identidade. O não fornecimento das informações solicitadas poderá
              resultar na impossibilidade de utilizar nossos serviços.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">8. Riscos</h2>
            <p>Você reconhece e concorda que:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                O mercado de criptomoedas é volátil e os preços podem flutuar
                significativamente
              </li>
              <li>
                Transações com criptomoedas envolvem riscos, incluindo perda
                total do investimento
              </li>
              <li>
                Você é o único responsável por avaliar os riscos e tomar
                decisões de investimento
              </li>
              <li>
                Não oferecemos conselhos de investimento, financeiros, legais ou
                fiscais
              </li>
              <li>
                Problemas técnicos podem ocorrer nas redes blockchain que estão
                fora do nosso controle
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              9. Propriedade Intelectual
            </h2>
            <p>
              Todos os direitos, títulos e interesses sobre a plataforma AdaPix,
              incluindo software, logotipos, marcas registradas, designs e
              conteúdo, são de propriedade exclusiva da AdaPix ou de seus
              licenciantes. Você não adquire quaisquer direitos de propriedade
              intelectual ao usar nossos serviços.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              10. Conduta do Usuário
            </h2>
            <p>Ao utilizar nossa plataforma, você concorda em não:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Violar qualquer lei aplicável ou regulamento</li>
              <li>
                Utilizar nossos serviços para atividades ilícitas ou
                fraudulentas
              </li>
              <li>
                Tentar acessar áreas restritas da plataforma ou interferir em
                seus mecanismos de segurança
              </li>
              <li>
                Utilizar bots, scrapers ou outros meios automatizados para
                acessar a plataforma
              </li>
              <li>Tentar prejudicar outros usuários ou a própria plataforma</li>
              <li>Compartilhar informações falsas ou enganosas</li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              11. Limitação de Responsabilidade
            </h2>
            <p>
              Em nenhum caso a AdaPix será responsável por quaisquer danos
              indiretos, incidentais, especiais, consequenciais ou punitivos,
              incluindo, sem limitação, perda de lucros, dados, uso, boa vontade
              ou outras perdas intangíveis resultantes do uso ou da
              impossibilidade de usar os serviços.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">12. Indenização</h2>
            <p>
              Você concorda em indenizar e isentar a AdaPix, seus diretores,
              funcionários e agentes de qualquer reclamação, responsabilidade,
              dano, perda e despesa relacionada à sua violação destes Termos de
              Uso ou ao uso indevido dos serviços.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              13. Modificações
            </h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a
              qualquer momento. Alterações entrarão em vigor imediatamente após
              a publicação dos Termos atualizados em nossa plataforma. O uso
              continuado dos serviços após tais alterações constitui sua
              aceitação dos novos termos.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">
              14. Legislação Aplicável
            </h2>
            <p>
              Estes Termos de Uso são regidos e interpretados de acordo com as
              leis do Brasil. Qualquer disputa decorrente destes Termos será
              submetida à jurisdição exclusiva dos tribunais brasileiros.
            </p>

            <h2 className="text-lg font-semibold mt-8 mb-4">15. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre estes Termos de Uso, entre em
              contato conosco pelo e-mail:{' '}
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
