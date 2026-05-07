import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Trophy, Flame, Target } from "lucide-react";
import { feed, ranking, challenges } from "@/data/social";

export const Route = createFileRoute("/app/social")({
  head: () => ({ meta: [{ title: "Social · ZYROX" }, { name: "description", content: "Feed, ranking e desafios da comunidade ZYROX." }] }),
  component: Social,
});

function Social() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Social</h1>
        <p className="text-sm text-muted-foreground">Feed da comunidade, desafios e ranking.</p>
      </div>

      <section>
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold"><Target className="h-4 w-4 text-cyan" />Desafios ativos</h2>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {challenges.map((c) => (
            <div key={c.id} className="w-64 shrink-0 rounded-2xl border border-border bg-gradient-surface p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">{c.days} dias restantes</div>
              <div className="mt-2 font-display text-base font-bold">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.goal}</div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
                <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${c.progress}%` }} />
              </div>
              <div className="mt-1 text-right text-xs font-semibold text-cyan">{c.progress}%</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Feed</h2>
        {feed.map((p) => (
          <article key={p.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-ai text-sm font-bold text-background">{p.avatar}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{p.user}</div>
                <div className="text-xs text-muted-foreground">{p.handle} · {p.time}</div>
              </div>
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">{p.workout}</span>
            </div>
            <p className="mt-3 text-sm">{p.caption}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              {p.volume > 0 && <span className="rounded-full bg-elevated px-2 py-1">📊 {p.volume.toLocaleString()} kg</span>}
              {p.pr && <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">🏆 {p.pr}</span>}
            </div>
            <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
              <button className="inline-flex items-center gap-1 hover:text-primary"><Heart className="h-4 w-4" /> {p.likes}</button>
              <button className="inline-flex items-center gap-1 hover:text-cyan"><MessageCircle className="h-4 w-4" /> {p.comments}</button>
            </div>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold"><Trophy className="h-4 w-4 text-primary" />Ranking</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {ranking.map((r) => (
            <div key={r.rank} className={`flex items-center gap-3 border-b border-border p-3 last:border-b-0 ${r.name === "Você" ? "bg-primary/5" : ""}`}>
              <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${r.rank <= 3 ? "bg-gradient-primary text-primary-foreground" : "bg-elevated text-muted-foreground"}`}>
                {r.rank}
              </div>
              <div className="flex-1 text-sm font-semibold">{r.name}</div>
              <div className="inline-flex items-center gap-1 text-xs text-primary"><Flame className="h-3 w-3" /> {r.streak}</div>
              <div className="font-display text-sm font-bold text-gradient-ai">{r.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
