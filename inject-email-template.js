// Cola isso no Console do navegador (F12 → Console) enquanto estiver na página do Firebase
(function() {
  function setField(el, value) {
    var setter = Object.getOwnPropertyDescriptor(el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur',   { bubbles: true }));
  }

  // ── Assunto ──────────────────────────────────────────────────────────────
  var subjectInput = Array.from(document.querySelectorAll('input')).find(function(i) {
    return i.value && (i.value.includes('Verify') || i.value.includes('APP_NAME') || i.value.includes('email'));
  });
  if (subjectInput) {
    setField(subjectInput, 'Confirme seu e-mail — 3D Body Scanner');
  }

  // ── Corpo HTML ───────────────────────────────────────────────────────────
  var newHtml = "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"\n  style=\"background-color:#09090b; padding:40px 16px; font-family:Helvetica,Arial,sans-serif;\">\n  <tr>\n    <td align=\"center\">\n      <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\"\n        style=\"width:100%; max-width:460px;\">\n\n        <!-- MASCOTE -->\n        <tr>\n          <td align=\"center\" style=\"padding-bottom:24px;\">\n            <img\n              src=\"https://3dbodyscan.herculesacademiarv.workers.dev/mascote-sem-fundo.png\"\n              width=\"90\" height=\"90\"\n              alt=\"3D Body Scanner\"\n              style=\"display:block; margin:0 auto;\" />\n          </td>\n        </tr>\n\n        <!-- CARD PRINCIPAL -->\n        <tr>\n          <td style=\"background-color:#18181b; border:1px solid #27272a; border-radius:16px;\">\n\n            <!-- Barra cyan topo -->\n            <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n              <tr>\n                <td style=\"background-color:#22d3ee; height:4px; border-radius:16px 16px 0 0; font-size:0; line-height:0;\">&nbsp;</td>\n              </tr>\n            </table>\n\n            <!-- Conteúdo -->\n            <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n              <tr>\n                <td style=\"padding:40px 40px 36px; text-align:center;\">\n\n                  <p style=\"margin:0 0 20px; font-size:11px; font-weight:700; letter-spacing:4px; color:#22d3ee; text-transform:uppercase;\">3D Body Scanner</p>\n\n                  <h1 style=\"margin:0 0 12px; font-size:24px; font-weight:700; color:#fafafa; line-height:1.2;\">Confirme seu e-mail</h1>\n\n                  <p style=\"margin:0 0 36px; font-size:15px; line-height:1.6; color:#a1a1aa;\">\n                    Clique no botão abaixo para ativar sua conta.<br>\n                    O link expira em 24 horas.\n                  </p>\n\n                  <!-- Botão CTA -->\n                  <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"margin:0 auto 28px;\">\n                    <tr>\n                      <td style=\"background-color:#22d3ee; border-radius:10px; padding:14px 40px;\">\n                        <a href=\"%LINK%\" style=\"color:#09090b; font-size:16px; font-weight:700; text-decoration:none; display:block; white-space:nowrap;\">Verificar e-mail</a>\n                      </td>\n                    </tr>\n                  </table>\n\n                  <!-- Link alternativo -->\n                  <p style=\"margin:0 0 12px; font-size:13px; color:#71717a;\">Ou copie e cole este link no navegador:</p>\n                  <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"margin:0 auto 0;\">\n                    <tr>\n                      <td style=\"background-color:#0f172a; border:1px solid #1e293b; border-radius:8px; padding:10px 18px;\">\n                        <p style=\"margin:0; font-size:11px; color:#22d3ee; word-break:break-all; font-family:'Courier New',Courier,monospace;\">%LINK%</p>\n                      </td>\n                    </tr>\n                  </table>\n\n                </td>\n              </tr>\n            </table>\n\n            <!-- Divisor -->\n            <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n              <tr>\n                <td style=\"border-top:1px solid #27272a; font-size:0; line-height:0;\">&nbsp;</td>\n              </tr>\n            </table>\n\n            <!-- Rodapé do card -->\n            <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\n              <tr>\n                <td style=\"padding:20px 40px; text-align:center;\">\n                  <p style=\"margin:0; font-size:12px; line-height:1.6; color:#52525b;\">\n                    Se você não criou uma conta no 3D Body Scanner,<br>\n                    ignore este e-mail com segurança.\n                  </p>\n                </td>\n              </tr>\n            </table>\n\n          </td>\n        </tr>\n\n        <!-- RODAPÉ EXTERNO -->\n        <tr>\n          <td style=\"padding:24px 0 0; text-align:center;\">\n            <p style=\"margin:0; font-size:12px; color:#3f3f46;\">\n              &copy; 2025 3D Body Scanner &middot; Todos os direitos reservados\n            </p>\n          </td>\n        </tr>\n\n      </table>\n    </td>\n  </tr>\n</table>";

  var ta = Array.from(document.querySelectorAll('textarea')).find(function(t) {
    return t.value && (t.value.includes('DISPLAY_NAME') || t.value.includes('LINK%') || t.value.includes('Hello'));
  });
  if (!ta) { alert('Textarea não encontrada. Certifique que está na página de templates e em modo edição.'); return; }
  setField(ta, newHtml);

  var msg = [];
  if (subjectInput) msg.push('✓ Assunto atualizado');
  else msg.push('⚠ Assunto não encontrado — atualize manualmente para: "Confirme seu e-mail — 3D Body Scanner"');
  msg.push('✓ Corpo HTML injetado');
  msg.push('→ Clique em Salvar para confirmar.');
  alert(msg.join('\n'));
})();
