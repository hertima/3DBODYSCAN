import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Repeat, BookOpen } from "lucide-react";
import { getExercise } from "@/data/library";

export const Route = createFileRoute("/app/exercicio/$id")({
  head: ({ params }) => ({ meta: [{ title: `${getExercise(params.id)?.name ?? "Exercício"} · ZYROX` }] }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const ex = getExercise(id);
  const navigate = useNavigate();
  if (!ex) return <div>Não encontrado</div>;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate({ to: "/app/exercicios" })} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Biblioteca
      </button>

      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-surface">
        <div className="relative grid h-56 place-items-center bg-elevated">
          <div className="absolute inset-0 bg-gradient-ai opacity-10" />
          <div className="font-display text-5xl font-bold text-gradient-ai">GIF</div>
        </div>
        <div className="p-5">
          <div className="text-xs uppercase tracking-widest text-cyan">{ex.type} · {ex.muscle}</div>
          <h1 className="mt-1 font-display text-3xl font-bold">{ex.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{ex.biomechanics} · {ex.equipment}</p>
        </div>
      </div>

      <Section icon={<BookOpen className="h-4 w-4 text-cyan" />} title="Instruções">
        <ol className="space-y-2">
          {ex.instructions.map((i, k) => (
            <li key={k} className="flex gap-3 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-elevated text-xs font-bold text-primary">{k + 1}</span>
              <span className="text-foreground/90">{i}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section icon={<AlertTriangle className="h-4 w-4 text-destructive" />} title="Erros comuns">
        <ul className="space-y-1.5">
          {ex.mistakes.map((m, k) => (
            <li key={k} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-destructive">•</span> {m}
            </li>
          ))}
        </ul>
      </Section>

      {ex.alternatives.length > 0 && (
        <Section icon={<Repeat className="h-4 w-4 text-primary" />} title="Substituições">
          <div className="flex flex-wrap gap-2">
            {ex.alternatives.map((a) => {
              const alt = getExercise(a);
              if (!alt) return null;
              return (
                <Link key={a} to="/app/exercicio/$id" params={{ id: a }} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:border-primary/40">
                  {alt.name}
                </Link>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}
