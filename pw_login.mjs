import { chromium } from 'playwright';

const loginEmail = process.env.PW_LOGIN_EMAIL;
const loginPassword = process.env.PW_LOGIN_PASSWORD;

if (!loginEmail || !loginPassword) {
  throw new Error('Defina PW_LOGIN_EMAIL e PW_LOGIN_PASSWORD antes de rodar este script.');
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: undefined });
const page = await context.newPage();
await page.setViewportSize({ width: 390, height: 844 });

await page.goto('http://localhost:8081', { waitUntil: 'load' });
await page.waitForTimeout(2000);

await page.fill('input[type="email"]', loginEmail);
await page.fill('input[type="password"]', loginPassword);
await page.click('button[type="submit"]');
await page.waitForTimeout(5000);
console.log('URL após login:', page.url());

// Navega para configurações
await page.goto('http://localhost:8081/app/configuracoes', { waitUntil: 'load', timeout: 15000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: 'C:/Users/Lenovo/AppData/Local/Temp/pw_config.png' });
console.log('config screenshot ok');

// Ativa light theme — procura qualquer toggle/botão de tema
const html = await page.content();
const hasTheme = html.includes('tema') || html.includes('theme') || html.includes('Claro') || html.includes('light');
console.log('tem tema na página:', hasTheme);

// Inject localStorage light theme
await page.evaluate(() => {
  localStorage.setItem('zyrox.theme', 'light');
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'C:/Users/Lenovo/AppData/Local/Temp/pw_config_light.png' });
console.log('config light screenshot ok');

// Dashboard com light
await page.goto('http://localhost:8081/app/', { waitUntil: 'load', timeout: 15000 });
await page.waitForTimeout(3000);
await page.evaluate(() => {
  localStorage.setItem('zyrox.theme', 'light');
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/Users/Lenovo/AppData/Local/Temp/pw_dashboard_light.png' });
console.log('dashboard light screenshot ok');

await browser.close();
console.log('done');
