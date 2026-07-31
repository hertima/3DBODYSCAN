import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | 3D Body Scanner" },
      {
        name: "description",
        content:
          "Política de Privacidade do 3D Body Scanner: quais dados coletamos, como usamos, com quem compartilhamos e quais são seus direitos.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-black text-foreground">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-5 py-10 text-foreground lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <h1 className="mt-6 font-display text-2xl font-black text-foreground lg:text-3xl">
          Política de Privacidade
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Última atualização: 30 de julho de 2026</p>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Esta Política de Privacidade explica como o <strong className="text-foreground">3D Body Scanner</strong>{" "}
          ("nós", "nosso") coleta, usa, armazena e protege os dados dos usuários ("você") do aplicativo,
          em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>

        <Section title="1. Quais dados coletamos">
          <p>
            <strong className="text-foreground">Dados de cadastro:</strong> nome, e-mail e senha (armazenada de
            forma criptografada pelo Firebase Authentication).
          </p>
          <p>
            <strong className="text-foreground">Dados corporais e de saúde:</strong> altura, peso, medidas
            corporais, fotos enviadas para o Scan 3D e Food Scan, objetivos de treino e nível de
            experiência.
          </p>
          <p>
            <strong className="text-foreground">Dados de uso:</strong> treinos realizados, histórico de
            evolução, interações com o Coach de IA, preferências do aplicativo.
          </p>
          <p>
            <strong className="text-foreground">Dados técnicos:</strong> endereço IP, tipo de dispositivo,
            navegador e cookies/armazenamento local (localStorage) usados para manter você conectado e
            lembrar suas preferências.
          </p>
        </Section>

        <Section title="2. Como usamos seus dados">
          <p>
            Usamos seus dados para: criar e gerenciar sua conta; gerar, com auxílio de Inteligência
            Artificial, planos de treino e nutrição personalizados a partir das suas fotos e informações
            corporais; processar pagamentos de assinatura; enviar comunicações sobre o serviço; e
            melhorar a qualidade e a segurança do aplicativo.
          </p>
          <p>
            As fotos enviadas para o Scan 3D e Food Scan são processadas por serviços de Inteligência
            Artificial (OpenAI) exclusivamente para gerar sua análise corporal ou nutricional — não são
            usadas para treinar modelos de terceiros nem compartilhadas publicamente.
          </p>
        </Section>

        <Section title="3. Com quem compartilhamos seus dados">
          <p>Não vendemos seus dados pessoais. Compartilhamos dados apenas com prestadores de serviço que nos ajudam a operar o aplicativo:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong className="text-foreground">Google Firebase</strong> — autenticação, banco de dados e
              armazenamento de arquivos.
            </li>
            <li>
              <strong className="text-foreground">OpenAI</strong> — processamento de imagens e geração de
              planos de treino/nutrição por IA.
            </li>
            <li>
              <strong className="text-foreground">Cloudflare</strong> — hospedagem e entrega do aplicativo.
            </li>
            <li>
              <strong className="text-foreground">Processador de pagamentos</strong> — cobrança da
              assinatura (não temos acesso aos dados completos do seu cartão).
            </li>
          </ul>
          <p>Esses parceiros processam dados em nosso nome, sob obrigações contratuais de confidencialidade e segurança.</p>
        </Section>

        <Section title="4. Armazenamento e segurança">
          <p>
            Seus dados são armazenados em servidores do Google Firebase, com criptografia em trânsito
            (HTTPS/TLS) e controles de acesso por conta. Mantemos seus dados enquanto sua conta estiver
            ativa ou pelo tempo necessário para cumprir obrigações legais.
          </p>
        </Section>

        <Section title="5. Seus direitos (LGPD)">
          <p>Você pode, a qualquer momento, solicitar:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Confirmação da existência de tratamento dos seus dados;</li>
            <li>Acesso, correção ou atualização dos seus dados;</li>
            <li>Portabilidade dos seus dados;</li>
            <li>Exclusão da sua conta e dos dados associados;</li>
            <li>Revogação do consentimento dado.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail indicado na seção
            "Contato" abaixo.
          </p>
        </Section>

        <Section title="6. Cookies e armazenamento local">
          <p>
            Usamos o armazenamento local do navegador (localStorage) para manter você conectado e salvar
            preferências como idioma e tema. Não usamos cookies de rastreamento publicitário de
            terceiros.
          </p>
        </Section>

        <Section title="7. Menores de idade">
          <p>
            O 3D Body Scanner não é destinado a menores de 18 anos. Não coletamos intencionalmente dados
            de menores sem o consentimento de um responsável legal.
          </p>
        </Section>

        <Section title="8. Alterações nesta política">
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Alterações relevantes serão
            comunicadas dentro do aplicativo ou por e-mail.
          </p>
        </Section>

        <Section title="9. Contato">
          <p>
            Dúvidas sobre esta política ou sobre seus dados podem ser enviadas para{" "}
            <a href="mailto:contato@3dbodyscanneer.com" className="text-cyan underline">
              contato@3dbodyscanneer.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
