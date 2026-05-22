import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { AnimatedBar } from "../components/AnimatedBar";

export interface WorkoutCompleteVideoProps {
  name?: string;
  workoutName?: string;
  duration?: number;
  totalSets?: number;
  totalVolume?: number;
  calories?: number;
  exercises?: Array<{ name: string; sets: number; volume: number }>;
  weekNumber?: number;
  locale?: "pt" | "es" | "en" | "fr" | "de";
}

const copy = {
  pt:  { completed: "Treino Concluído",   week: "Semana", volumeLabel: "Volume total levantado", duration: "Duração",  sets: "Séries",  calories: "Calorias",  exercises: "Exercícios", series: "séries",  bodyweight: "corporal"       },
  es:  { completed: "Entreno Completado", week: "Semana", volumeLabel: "Volumen total levantado", duration: "Duración", sets: "Series",  calories: "Calorías",  exercises: "Ejercicios", series: "series",  bodyweight: "corporal"       },
  en:  { completed: "Workout Complete",   week: "Week",   volumeLabel: "Total volume lifted",     duration: "Duration", sets: "Sets",    calories: "Calories",  exercises: "Exercises",  series: "sets",    bodyweight: "bodyweight"     },
  fr:  { completed: "Entraînement Terminé", week: "Semaine", volumeLabel: "Volume total soulevé", duration: "Durée",   sets: "Séries",  calories: "Calories",  exercises: "Exercices",  series: "séries",  bodyweight: "poids du corps" },
  de:  { completed: "Training Abgeschlossen", week: "Woche", volumeLabel: "Gesamtvolumen gehoben", duration: "Dauer", sets: "Sätze",   calories: "Kalorien",  exercises: "Übungen",    series: "Sätze",   bodyweight: "Körpergewicht"  },
};

export function WorkoutCompleteVideo({
  name = "Atleta",
  workoutName = "Push A",
  duration = 62,
  totalSets = 24,
  totalVolume = 4200,
  calories = 380,
  exercises = [],
  weekNumber = 1,
  locale = "pt",
}: WorkoutCompleteVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = copy[locale] ?? copy.pt;

  const headerOpacity  = interpolate(frame, [0,  20],  [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity   = interpolate(frame, [8,  28],  [0, 1], { extrapolateRight: "clamp" });
  const mascotScale    = spring({ frame: frame - 15, fps, config: { damping: 13, stiffness: 90 } });
  const badgeScale     = spring({ frame: frame - 35, fps, config: { damping: 14, stiffness: 130 } });
  const metricsOpacity = interpolate(frame, [45, 65],  [0, 1], { extrapolateRight: "clamp" });
  const exOpacity      = interpolate(frame, [60, 80],  [0, 1], { extrapolateRight: "clamp" });
  const footerOpacity  = interpolate(frame, [75, 95],  [0, 1], { extrapolateRight: "clamp" });

  const displayExercises = exercises.slice(0, 5);

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif", overflow: "hidden" }}>
      <GradientBackground variant="workout" />

      {/* Glows de fundo */}
      <div style={{ position:"absolute", top:-60, left:-60, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(251,146,60,0.12) 0%,transparent 70%)", filter:"blur(40px)" }} />
      <div style={{ position:"absolute", bottom:100, right:-80, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(34,211,238,0.10) 0%,transparent 70%)", filter:"blur(40px)" }} />

      {/* ── 1. TOP BRANDING ── top: 70 */}
      <div style={{
        position:"absolute", top:70, left:0, right:0,
        display:"flex", alignItems:"center", justifyContent:"center", gap:14,
        opacity: headerOpacity,
      }}>
        <img src="/logo favicton 3D Body Scanner.png" style={{ width:52, height:52, borderRadius:14, boxShadow:"0 0 24px rgba(34,211,238,0.6)" }} />
        <span style={{ fontWeight:900, fontSize:24, letterSpacing:-0.5, background:"linear-gradient(90deg,#22d3ee,#fff,#fb923c)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          3D Body Scanner
        </span>
      </div>

      {/* ── 2. TÍTULO + NOME DO TREINO ── top: 190 */}
      <div style={{
        position:"absolute", top:190, left:48, right:48,
        textAlign:"center", opacity: titleOpacity,
      }}>
        <div style={{ fontSize:16, color:"rgba(148,163,184,0.65)", letterSpacing:5, textTransform:"uppercase", marginBottom:10 }}>
          {t.completed}
        </div>
        <div style={{ fontSize:40, fontWeight:900, lineHeight:1.15, letterSpacing:-0.5, background:"linear-gradient(90deg,#fb923c,#fff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          {workoutName}
        </div>
        <div style={{ fontSize:17, color:"rgba(148,163,184,0.5)", marginTop:10 }}>
          {name} · {t.week} {weekNumber}
        </div>
      </div>

      {/* ── 3. MASCOTE ── top: 420 */}
      <div style={{
        position:"absolute", top:420, left:0, right:0,
        display:"flex", justifyContent:"center",
        transform:`scale(${mascotScale})`,
        filter:"drop-shadow(0 0 70px rgba(34,211,238,0.5)) drop-shadow(0 0 35px rgba(251,146,60,0.4))",
      }}>
        <img src="/superhero character.png" style={{ width:440, height:440, objectFit:"contain" }} />
      </div>

      {/* ── 4. VOLUME BADGE ── top: 880 */}
      <div style={{ position:"absolute", top:880, left:48, right:48, display:"flex", justifyContent:"center" }}>
        <div style={{
          transform:`scale(${badgeScale})`,
          background:"rgba(251,146,60,0.1)", border:"2px solid rgba(251,146,60,0.35)",
          borderRadius:28, padding:"22px 48px", textAlign:"center", width:"100%",
          boxShadow:"0 0 40px rgba(251,146,60,0.12)",
        }}>
          <div style={{ fontSize:13, color:"rgba(251,146,60,0.8)", letterSpacing:4, textTransform:"uppercase", marginBottom:4 }}>
            {t.volumeLabel}
          </div>
          <AnimatedCounter from={0} to={totalVolume / 1000} startFrame={30} endFrame={65} decimals={2} suffix=" t" style={{ fontSize:68, fontWeight:900, color:"#fb923c", display:"block", lineHeight:1 }} />
        </div>
      </div>

      {/* ── 5. MÉTRICAS ── top: 1080 */}
      <Sequence from={45}>
        <div style={{ position:"absolute", top:1080, left:48, right:48, display:"flex", gap:18, opacity:metricsOpacity }}>
          {[
            { label: t.duration, value:`${duration}min`,        color:"#22d3ee" },
            { label: t.sets,     value: String(totalSets),      color:"#a78bfa" },
            { label: t.calories, value:`${calories}kcal`,       color:"#4ade80" },
          ].map((m,i) => (
            <div key={i} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:`1.5px solid ${m.color}40`, borderRadius:22, padding:"20px 10px", textAlign:"center", boxShadow:`0 0 20px ${m.color}18` }}>
              <div style={{ fontSize:11, color:"rgba(148,163,184,0.5)", letterSpacing:2.5, textTransform:"uppercase", marginBottom:8 }}>{m.label}</div>
              <div style={{ fontSize:28, fontWeight:900, color:m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </Sequence>

      {/* ── 6. EXERCÍCIOS ── top: 1280 */}
      <Sequence from={60}>
        <div style={{ position:"absolute", top:1280, left:48, right:48, opacity:exOpacity }}>
          <div style={{ fontSize:12, color:"rgba(148,163,184,0.4)", letterSpacing:3.5, textTransform:"uppercase", marginBottom:20 }}>
            {t.exercises}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {displayExercises.map((ex, i) => {
              const barPct = totalVolume > 0 ? (ex.volume / totalVolume) * 100 : 60;
              const entryOpacity = interpolate(frame, [60+i*8, 78+i*8], [0,1], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
              return (
                <div key={i} style={{ opacity:entryOpacity }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:16, fontWeight:700, color:"#e2e8f0" }}>{ex.name}</span>
                    <span style={{ fontSize:13, color:"rgba(148,163,184,0.5)" }}>
                      {ex.sets} {t.series}{ex.volume > 0 ? ` · ${ex.volume} kg` : ` · ${t.bodyweight}`}
                    </span>
                  </div>
                  <AnimatedBar pct={barPct} startFrame={60+i*8} color="#fb923c" height={6} />
                </div>
              );
            })}
          </div>
        </div>
      </Sequence>

      {/* ── 7. FOOTER ── bottom: 70 */}
      <div style={{ position:"absolute", bottom:70, left:0, right:0, display:"flex", flexDirection:"column", alignItems:"center", gap:14, opacity:footerOpacity }}>
        <div style={{ width:200, height:1, background:"linear-gradient(90deg,transparent,rgba(34,211,238,0.4),transparent)" }} />
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <img src="/logo favicton 3D Body Scanner.png" style={{ width:40, height:40, borderRadius:11, boxShadow:"0 0 16px rgba(34,211,238,0.5)" }} />
          <span style={{ fontWeight:900, fontSize:20, letterSpacing:-0.5, background:"linear-gradient(90deg,#22d3ee,#fff,#fb923c)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            3D Body Scanner
          </span>
        </div>
        <div style={{ fontSize:12, color:"rgba(148,163,184,0.3)", letterSpacing:2 }}>zyrox.app</div>
      </div>
    </AbsoluteFill>
  );
}
