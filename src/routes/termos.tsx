import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso | 3D Body Scanner" },
      {
        name: "description",
        content:
          "Termos de Uso do 3D Body Scanner: regras de uso do aplicativo, assinatura, cancelamento e responsabilidades.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: TermsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-black text-foreground">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-5 py-10 text-foreground lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <h1 className="mt-6 font-display text-2xl font-black text-foreground lg:text-3xl">Termos de Uso</h1>
        <p className="mt-2 text-sm text-muted-foreground">Última atualização: 30 de julho de 2026</p>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Ao criar uma conta ou usar o <strong className="text-foreground">3D Body Scanner</strong>, você
          concorda com estes Termos de Uso. Leia com atenção antes de usar o aplicativo.
        </p>

        <Section title="1. Descrição do serviço">
          <p>
            O 3D Body Scanner é um aplicativo de treino e nutrição personalizado por Inteligência
            Artificial, que utiliza fotos e dados corporais enviados por você para gerar planos de
            treino, dieta e acompanhamento de evolução física.
          </p>
        </Section>

        <Section title="2. Elegibilidade e conta">
          <p>
            Você precisa ter 18 anos ou mais para criar uma conta. Você é responsável por manter a
            confidencialidade da sua senha e por todas as atividades realizadas na sua conta.
          </p>
        </Section>

        <Section title="3. Assinatura e pagamento">
          <p>
            O acesso completo ao aplicativo é feito por assinatura paga, cobrada de forma recorrente
            (mensal ou anual, conforme o plano escolhido) até que você cancele. Os valores e condições
            vigentes são exibidos na tela de assinatura antes da confirmação da compra.
          </p>
          <p>
            Oferecemos garantia de reembolso de 7 dias a partir da primeira cobrança, conforme detalhado
            na tela de assinatura. Após esse período, cancelamentos interrompem a renovação, mas não
            geram reembolso proporcional do ciclo já pago.
          </p>
        </Section>

        <Section title="4. Cancelamento">
          <p>
            Você pode cancelar sua assinatura a qualquer momento pelas configurações da conta. O
            cancelamento interrompe cobranças futuras; o acesso permanece ativo até o fim do período já
            pago.
          </p>
        </Section>

        <Section title="5. Uso aceitável">
          <p>Ao usar o aplicativo, você concorda em não:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Enviar fotos ou conteúdo de terceiros sem consentimento;</li>
            <li>Usar o aplicativo para fins ilegais ou fraudulentos;</li>
            <li>Tentar acessar dados de outros usuários ou violar a segurança do sistema;</li>
            <li>Copiar, revender ou redistribuir o conteúdo gerado pelo aplicativo sem autorização.</li>
          </ul>
        </Section>

        <Section title="6. Aviso de saúde">
          <p>
            O 3D Body Scanner utiliza Inteligência Artificial para gerar recomendações de treino e
            nutrição com base nas informações que você fornece. Isso{" "}
            <strong className="text-foreground">não substitui</strong> orientação médica, nutricional ou
            de um profissional de educação física. Consulte um profissional de saúde antes de iniciar
            qualquer programa de treino ou dieta, especialmente se você tiver condições de saúde
            preexistentes.
          </p>
        </Section>

        <Section title="7. Propriedade intelectual">
          <p>
            O aplicativo, sua marca, design e conteúdo (exceto o conteúdo enviado por você) pertencem ao
            3D Body Scanner e são protegidos por leis de propriedade intelectual. Você mantém a
            titularidade das fotos e dados que envia, e nos concede licença limitada para processá-los
            unicamente para fornecer o serviço.
          </p>
        </Section>

        <Section title="8. Limitação de responsabilidade">
          <p>
            O aplicativo é fornecido "como está". Não garantimos resultados específicos de evolução
            física, já que estes dependem de fatores individuais fora do nosso controle. Na máxima
            extensão permitida por lei, não nos responsabilizamos por danos indiretos decorrentes do uso
            do aplicativo.
          </p>
        </Section>

        <Section title="9. Alterações nestes termos">
          <p>
            Podemos atualizar estes Termos periodicamente. O uso continuado do aplicativo após uma
            atualização constitui aceitação dos novos termos.
          </p>
        </Section>

        <Section title="10. Lei aplicável">
          <p>Estes Termos são regidos pelas leis da República Federativa do Brasil.</p>
        </Section>

        <Section title="11. Contato">
          <p>
            Dúvidas sobre estes Termos podem ser enviadas para{" "}
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
