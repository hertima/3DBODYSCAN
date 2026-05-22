import fs from 'fs';
import path from 'path';

const token = '_AL3breHmYxbItZX7V_QAxW14lcfnpZJY8NqJzYa0yE.ZlP86lIYiomfMd4wqZJSYOHqZ0B_GfN0XfHUbJEkdbc';
const accountId = 'e62851470ed2d28660bbf8004378f672';
const scriptName = '3dbodyscan';

const outputDir = 'c:\\projetos\\body scanner\\cloudflare-download';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function downloadWorker() {
  // 1. Baixar o script principal (multipart com todos os módulos)
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`;
  console.log('Baixando Worker do Cloudflare...');
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  console.log(`Status: ${response.status}`);
  const contentType = response.headers.get('content-type');
  console.log(`Tipo: ${contentType}`);

  if (!response.ok) {
    console.error('Erro:', await response.text());
    process.exit(1);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  
  // Salvar o pacote completo
  let ext = 'bin';
  if (contentType?.includes('javascript')) ext = 'js';
  else if (contentType?.includes('multipart')) ext = 'multipart';
  else if (contentType?.includes('json')) ext = 'json';

  const mainFile = path.join(outputDir, `worker.${ext}`);
  fs.writeFileSync(mainFile, buffer);
  console.log(`Worker salvo em: ${mainFile} (${(buffer.length / 1024).toFixed(1)} KB)`);

  // 2. Se é multipart, extrair os módulos
  if (contentType?.includes('multipart')) {
    const boundary = contentType.match(/boundary=(.+)/)?.[1];
    if (boundary) {
      const text = buffer.toString('utf-8');
      const parts = text.split(`--${boundary}`).filter(p => p.trim() && p.trim() !== '--');
      console.log(`${parts.length} módulos encontrados no pacote`);
      
      let moduleCount = 0;
      for (const part of parts) {
        const nameMatch = part.match(/name="([^"]+)"/);
        if (!nameMatch) continue;
        const name = nameMatch[1];
        
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;
        
        const body = part.substring(headerEnd + 4).replace(/\r\n$/, '');
        const safeName = name.replace(/\//g, '_');
        const modFile = path.join(outputDir, safeName);
        fs.writeFileSync(modFile, body);
        moduleCount++;
      }
      console.log(`${moduleCount} arquivos extraídos em: ${outputDir}`);
    }
  }

  console.log('\nPronto! Versão do Cloudflare baixada com sucesso.');
}

downloadWorker().catch(e => { console.error(e); process.exit(1); });
