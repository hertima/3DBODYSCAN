import { chromium } from "playwright";
const BASE = "http://localhost:8081";
const CONCURRENCY = 3;
const TOTAL = 100;
const STEP_WAIT = 700; // espera depois de cada transicao de tela

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function clickOption(page, index = 0) {
  const selectors = [
    "button.rounded-2xl.border",
    "button.rounded-3xl.border",
    'button.rounded-full.border:not(:has-text("Continuar"))',
  ];
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const sel of selectors) {
      const candidates = page.locator(sel);
      const count = await candidates.count();
      if (count > index) {
        const target = candidates.nth(index);
        await target.scrollIntoViewIfNeeded();
        await target.click({ timeout: 5000 });
        return true;
      }
    }
    await page.waitForTimeout(400); // tela pode ainda estar transicionando
  }
  return false;
}

async function clickContinuar(page) {
  const btn = page.getByRole("button", { name: /continuar/i });
  await btn.waitFor({ state: "visible", timeout: 10000 });
  // espera o botao estabilizar (nao ficar clicando em cima da transicao anterior)
  for (let i = 0; i < 10; i++) {
    if (!(await btn.isDisabled())) break;
    await page.waitForTimeout(300);
  }
  if (await btn.isDisabled()) return false;
  await btn.click();
  await page.waitForTimeout(STEP_WAIT);
  return true;
}

async function runOnboarding(browser, index) {
  const rng = mulberry32(1000 + index);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  // garante que o banner de "instalar app" (aparece sozinho apos 5s no desktop)
  // nunca apareca — precisa rodar ANTES de qualquer script da pagina, ou o
  // componente ja monta e checa o sessionStorage antes da gente conseguir setar.
  await context.addInitScript(() => {
    sessionStorage.setItem("install-dismissed", "1");
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 200)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 200)); });

  const sexIndex = Math.floor(rng() * 2); // 0 = primeira opcao (Masculino), 1 = segunda (Feminino)
  const sexLabel = sexIndex === 0 ? "masculino" : "feminino";

  const t0 = Date.now();
  try {
    await page.goto(BASE, { waitUntil: "load", timeout: 30000 });
    await page.evaluate(() => localStorage.clear());

    await page.goto(`${BASE}/onboarding/1`, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(STEP_WAIT);

    const VERBOSE = process.env.VERBOSE === "1";
    const log = (label) => { if (VERBOSE) console.log(`[${index}] ${label} -> ${page.url()}`); };

    await clickContinuar(page); log("depois-nome"); // step 1 (nome)
    await clickOption(page, Math.floor(rng() * 5)); log("clicou-objetivo");
    await clickContinuar(page); log("depois-objetivo");
    await clickOption(page, Math.floor(rng() * 5)); log("clicou-problema");
    await clickContinuar(page); log("depois-problema");
    await clickOption(page, Math.floor(rng() * 3)); log("clicou-experiencia");
    await clickContinuar(page); log("depois-experiencia");

    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill(String(50 + Math.floor(rng() * 60)));
    await inputs.nth(1).fill(String(155 + Math.floor(rng() * 45)));
    await inputs.nth(2).fill(String(18 + Math.floor(rng() * 60)));
    await clickContinuar(page); log("depois-corporal");

    await clickOption(page, Math.floor(rng() * 3)); log("clicou-metabolismo");
    await clickContinuar(page); log("depois-metabolismo");

    await clickOption(page, 0); // foco muscular
    await clickOption(page, 1);
    log("clicou-foco");
    await clickContinuar(page); log("depois-foco");

    await clickOption(page, Math.floor(rng() * 4)); log("clicou-local");
    await clickContinuar(page); log("depois-local");

    await clickOption(page, Math.floor(rng() * 3)); log("clicou-tipotreino");
    await clickContinuar(page); log("depois-tipotreino");

    const contBtn = page.getByRole("button", { name: /continuar/i });
    if (await contBtn.isDisabled()) {
      await clickOption(page, 0); // equipamento (se precisar)
      await clickOption(page, 1);
      log("clicou-equipamento");
    }
    await clickContinuar(page); log("depois-equipamento");

    await clickOption(page, Math.floor(rng() * 4)); log("clicou-alimentar");
    await clickContinuar(page); log("depois-alimentar");

    await clickOption(page, sexIndex); log("clicou-sexo");
    await clickContinuar(page); log("depois-sexo");

    const dayButtons = page.locator("button").filter({ hasText: /^(Seg|Ter|Qua|Qui|Sex|S[aá]b|Dom|S|T|Q|D)$/ });
    const dayCount = await dayButtons.count();
    const daysToClick = Math.max(1, Math.min(dayCount, 1 + Math.floor(rng() * dayCount)));
    for (let i = 0; i < daysToClick; i++) await dayButtons.nth(i).click();
    await clickContinuar(page);

    await page.waitForTimeout(7500); // animacao IA analisando

    const finalUrl = page.url();
    const onboardingState = await page.evaluate(() => {
      const raw = localStorage.getItem("zyrox.onboarding");
      return raw ? JSON.parse(raw) : null;
    });

    const ok = finalUrl.includes("/paywall") && !!onboardingState?.completedAt && !!onboardingState?.calorieTarget;

    await context.close();
    return {
      index, sex: sexLabel, ok, finalUrl, timeMs: Date.now() - t0,
      goal: onboardingState?.goal, calorieTarget: onboardingState?.calorieTarget,
      errors: errors.slice(0, 5),
    };
  } catch (err) {
    await context.close().catch(() => {});
    return { index, sex: sexLabel, ok: false, error: err.message.split("\n")[0], timeMs: Date.now() - t0, errors: errors.slice(0, 5) };
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let batchStart = 0; batchStart < TOTAL; batchStart += CONCURRENCY) {
    const batch = [];
    for (let i = batchStart; i < Math.min(batchStart + CONCURRENCY, TOTAL); i++) {
      batch.push(runOnboarding(browser, i));
    }
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    console.log(`Lote ${Math.floor(batchStart / CONCURRENCY) + 1}/${Math.ceil(TOTAL / CONCURRENCY)}: ${batchResults.filter(r => r.ok).length}/${batchResults.length} ok (total ate agora: ${results.filter(r => r.ok).length}/${results.length})`);
  }

  const successCount = results.filter((r) => r.ok).length;
  const failures = results.filter((r) => !r.ok);
  const avgTime = results.reduce((s, r) => s + r.timeMs, 0) / results.length;

  const male = results.filter((r) => r.sex === "masculino");
  const female = results.filter((r) => r.sex === "feminino");

  console.log(`\n=== RESULTADO FINAL: ${successCount}/${TOTAL} ===`);
  console.log(`MASCULINO: ${male.filter(r => r.ok).length}/${male.length} sucesso`);
  console.log(`FEMININO: ${female.filter(r => r.ok).length}/${female.length} sucesso`);
  console.log(`Tempo médio por onboarding: ${(avgTime / 1000).toFixed(1)}s`);

  if (failures.length > 0) {
    console.log(`\n=== FALHAS (${failures.length}) ===`);
    for (const f of failures.slice(0, 15)) console.log(JSON.stringify(f));
  }

  await browser.close();
})().catch((e) => { console.error("FALHA GERAL:", e); process.exit(1); });
