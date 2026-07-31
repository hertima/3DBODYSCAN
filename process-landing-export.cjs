const fs = require("fs");
const cheerio = require("cheerio");

const SRC = "C:/Users/Lenovo/AppData/Local/Temp/landing-raw.html";
const OUT = "c:/projetos/body scanner/dist/hostinger-landing/landing/index.html";
const CTA_URL = "https://app.3dbodyscanneer.com/criar-conta";

const FAQ_ITEMS = [
  { q: "Preciso de algum equipamento para fazer o Scan Corporal 3D?", a: "Não. Basta a câmera do seu celular. Em poucos segundos a Inteligência Artificial analisa seu corpo e gera seu retrato completo de composição corporal." },
  { q: "O treino funciona tanto pra academia quanto pra casa?", a: "Sim. No cadastro você informa onde treina e quais equipamentos tem disponíveis, e a IA monta um programa 100% adaptado ao seu ambiente." },
  { q: "Sou iniciante, o app funciona pra mim?", a: "Sim. A IA considera seu nível de experiência antes de criar qualquer plano — desde o primeiro treino até fases mais avançadas." },
  { q: "A IA realmente ajusta o plano sozinha?", a: "Sim. A cada novo Scan Corporal, a Inteligência Artificial recalcula automaticamente treino, alimentação e estratégia com base na sua evolução real." },
  { q: "Como funciona a garantia de 7 dias?", a: "Se dentro dos primeiros 7 dias você achar que o 3D Body Scanner não é pra você, devolvemos 100% do valor pago. Sem burocracia." },
  { q: "Posso cancelar quando quiser?", a: "Sim. Tanto no plano mensal quanto no anual, você cancela diretamente pelo app, sem multa e sem precisar ligar pra ninguém." },
];

let html = fs.readFileSync(SRC, "utf8");

html = html.replace(/<script>if\('serviceWorker'[\s\S]*?<\/script>/, "");
html = html.replace(/<script class="\$tsr"[\s\S]*?<\/script>/, "");
html = html.replace(/<script type="module" async="">import\("\/assets\/index-[^"]*"\)<\/script>/, "");

html = html.replace("+<!-- -->0</span>", "+<!-- -->80.000</span>");
let pctCount = 0;
const pctFinal = ["24,8", "18,4"];
html = html.replace(/0,0<!-- -->%/g, () => `${pctFinal[pctCount++]}<!-- -->%`);

const $ = cheerio.load(html, { decodeEntities: false });

const $mascotBox = $('div[style*="aspect-ratio:1024/1536"]');
$mascotBox.html(
  '<img src="/MASCOTE%20SEM%20FUNDO.png" alt="3D Body Scanner" style="width:100%;height:100%;object-fit:contain;">',
);

$("[style]").each((_, el) => {
  const style = $(el).attr("style");
  if (!style) return;
  if (style.includes("opacity:0")) {
    const next = style.replace(/opacity:0/g, "opacity:1").replace(/translateY\(24px\)/g, "translateY(0)");
    $(el).attr("style", next);
  }
});

// Buttons inside #precos are real purchase CTAs -> link to signup.
// Buttons elsewhere (hero, final CTA section) only ever scrolled to #precos -> keep that behavior as a plain anchor.
const $pricingSection = $("#precos");
$("button").each((_, el) => {
  const $el = $(el);
  if (!$el.text().includes("Começar Agora")) return;
  const isInsidePricing = $el.closest("#precos").length > 0;
  const cls = $el.attr("class") || "";
  const originalStyle = $el.attr("style") || "";
  const inner = $el.html();
  const href = isInsidePricing ? CTA_URL : "#precos";
  const a = $(
    `<a href="${href}" class="${cls}" style="${originalStyle}${originalStyle ? ";" : ""}text-decoration:none;">${inner}</a>`,
  );
  $el.replaceWith(a);
});

$("head").append(`<style>html{scroll-behavior:smooth;}</style>`);

$("button").each((_, el) => {
  const $btn = $(el);
  const text = $btn.text().trim();
  const item = FAQ_ITEMS.find((f) => text.includes(f.q));
  if (!item) return;
  const $wrapper = $btn.parent();
  const wrapperCls = $wrapper.attr("class") || "";
  const summaryCls = $btn.attr("class") || "";
  const details = $(
    `<details class="faq-item ${wrapperCls}"><summary class="${summaryCls}">${$btn.html()}</summary><p class="px-5 pb-4 text-base leading-relaxed text-muted-foreground">${item.a}</p></details>`,
  );
  $wrapper.replaceWith(details);
});

$("head").append(`<style>
details.faq-item > summary { list-style: none; cursor: pointer; }
details.faq-item > summary::-webkit-details-marker { display: none; }
details.faq-item > summary::marker { content: ""; }
details.faq-item[open] > summary svg { transform: rotate(180deg); }
details.faq-item > summary svg { transition: transform 0.2s; }
</style>`);

fs.writeFileSync(OUT, $.html(), "utf8");
console.log("wrote", fs.statSync(OUT).size, "bytes");
