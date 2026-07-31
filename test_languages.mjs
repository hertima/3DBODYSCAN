import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const BASE = 'http://localhost:8080';
const EMAIL = process.env.PW_LOGIN_EMAIL;
const PASS = process.env.PW_LOGIN_PASSWORD;
if (!EMAIL || !PASS) {
  throw new Error('Defina PW_LOGIN_EMAIL e PW_LOGIN_PASSWORD antes de rodar este script.');
}
const SHOT_DIR = 'C:/Users/Lenovo/AppData/Local/Temp/lang_test';

// cria diretório de screenshots
import { mkdirSync } from 'fs';
try { mkdirSync(SHOT_DIR, { recursive: true }); } catch {}

const LOCALES = ['pt', 'es', 'en', 'fr', 'de'];

// Strings que devem aparecer por idioma em cada tela
const EXPECTED = {
  pt: { dash: ['Treinos', 'Início'], nav: ['Treinos', 'Biblioteca'], settings: ['Configurações', 'Idioma'] },
  es: { dash: ['Entrenos', 'Inicio'], nav: ['Entrenos', 'Biblioteca'], settings: ['Configuración', 'Idioma'] },
  en: { dash: ['Workouts', 'Home'], nav: ['Workouts', 'Library'], settings: ['Settings', 'Language'] },
  fr: { dash: ['Séances', 'Accueil'], nav: ['Séances', 'Bibliothèque'], settings: ['Paramètres', 'Langue'] },
  de: { dash: ['Training', 'Start'], nav: ['Training', 'Bibliothek'], settings: ['Einstellungen', 'Sprache'] },
};

const results = [];

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

// --- LOGIN ---
console.log('→ fazendo login...');
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
await page.fill('input[type="email"]', EMAIL);
await page.fill('input[type="password"]', PASS);
await page.click('button[type="submit"]');

// aguarda dashboard carregar
try {
  await page.waitForURL('**/app/**', { timeout: 20000 });
  await page.waitForTimeout(3000);
  console.log('✓ login ok — url:', page.url());
} catch {
  await page.screenshot({ path: `${SHOT_DIR}/login_failed.png` });
  console.log('✗ login falhou — screenshot salvo');
  await browser.close();
  process.exit(1);
}

// --- TESTA CADA IDIOMA ---
for (const locale of LOCALES) {
  console.log(`\n=== TESTANDO: ${locale.toUpperCase()} ===`);

  // injeta locale via localStorage e recarrega
  await page.evaluate((loc) => {
    localStorage.setItem('zyrox.locale', loc);
  }, locale);

  // DASHBOARD
  await page.goto(`${BASE}/app/`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${SHOT_DIR}/${locale}_01_dashboard.png` });
  const dashContent = await page.content();

  // TREINOS
  await page.goto(`${BASE}/app/treinos`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SHOT_DIR}/${locale}_02_treinos.png` });
  const treinosContent = await page.content();

  // EXERCÍCIOS / LIBRARY
  await page.goto(`${BASE}/app/exercicios`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SHOT_DIR}/${locale}_03_exercicios.png` });

  // ANALYTICS
  await page.goto(`${BASE}/app/analytics`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SHOT_DIR}/${locale}_04_analytics.png` });

  // NUTRIÇÃO
  await page.goto(`${BASE}/app/nutricao`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SHOT_DIR}/${locale}_05_nutricao.png` });

  // CONFIGURAÇÕES
  await page.goto(`${BASE}/app/configuracoes`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SHOT_DIR}/${locale}_06_configuracoes.png` });
  const configContent = await page.content();

  // verifica strings esperadas
  const exp = EXPECTED[locale];
  const checks = {
    dash_nav: exp.nav.map(s => ({ text: s, found: dashContent.includes(s) })),
    settings: exp.settings.map(s => ({ text: s, found: configContent.includes(s) })),
  };

  const allOk = [...checks.dash_nav, ...checks.settings].every(c => c.found);
  const failed = [...checks.dash_nav, ...checks.settings].filter(c => !c.found);

  results.push({ locale, ok: allOk, failed: failed.map(f => f.text) });
  console.log(allOk ? `  ✓ ${locale}: todas as strings ok` : `  ✗ ${locale}: faltando: ${failed.map(f => f.text).join(', ')}`);
}

// --- TESTA TROCA REAL VIA UI ---
console.log('\n=== TESTANDO TROCA DE IDIOMA PELA UI ===');
// volta para PT primeiro
await page.evaluate(() => localStorage.setItem('zyrox.locale', 'pt'));
await page.goto(`${BASE}/app/`, { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);

// vai para configurações e troca para EN
await page.goto(`${BASE}/app/configuracoes`, { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${SHOT_DIR}/ui_switch_01_before_pt.png` });

// clica no LocaleSwitcher (botão de idioma)
try {
  await page.click('button[aria-label="Trocar idioma"]', { timeout: 5000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOT_DIR}/ui_switch_02_dropdown_open.png` });

  // clica em English
  await page.click('text=English', { timeout: 5000 });
  await page.waitForURL('**', { timeout: 10000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${SHOT_DIR}/ui_switch_03_after_en.png` });

  const afterContent = await page.content();
  const hasEN = afterContent.includes('Settings') || afterContent.includes('Language');
  console.log(hasEN ? '  ✓ troca via UI ok — página em inglês' : '  ✗ troca via UI — strings inglesas não encontradas');
} catch (e) {
  console.log('  ! não foi possível testar troca via UI:', e.message);
}

await browser.close();

// RELATÓRIO FINAL
console.log('\n=== RELATÓRIO FINAL ===');
for (const r of results) {
  console.log(`${r.ok ? '✓' : '✗'} ${r.locale.toUpperCase()}: ${r.ok ? 'OK' : 'FALHOU — faltando: ' + r.failed.join(', ')}`);
}
console.log(`\nScreenshots em: ${SHOT_DIR}`);
