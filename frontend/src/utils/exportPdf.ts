import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Receipt } from '../types';

const A4_W_PX = 794;
const A4_H_PX = 1123;
const SCALE = 2;
const PADDING = 24;
const GAP = 12;

async function ensureNotoSansKR() {
  const id = 'noto-sans-kr-pdf';
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap';
    document.head.appendChild(link);
  }
  try {
    await document.fonts.load("700 16px 'Noto Sans KR'");
    await document.fonts.load("400 16px 'Noto Sans KR'");
  } catch {
    await document.fonts.ready;
  }
}

function buildContainer(cols: number): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed; left:-9999px; top:0;
    width:${A4_W_PX}px;
    background:#fff;
    padding:${PADDING}px;
    box-sizing:border-box;
    font-family:'Noto Sans KR',sans-serif;
  `;
  const cardWidth = Math.floor((A4_W_PX - PADDING * 2 - GAP * (cols - 1)) / cols);
  el.dataset.cols = String(cols);
  el.dataset.cardWidth = String(cardWidth);
  return el;
}

function buildTitle(): HTMLHeadingElement {
  const h = document.createElement('h2');
  h.style.cssText = `
    text-align:center; font-size:26px; font-weight:700;
    border-bottom:3px solid #000; padding-bottom:16px;
    margin:0 0 24px; letter-spacing:10px;
    font-family:'Noto Sans KR',sans-serif;
  `;
  h.textContent = '영 수 증 증 빙 철';
  return h;
}

function row(label: string, value: string): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0';
  const b = document.createElement('span');
  b.style.fontWeight = '700';
  b.textContent = `${label} :`;
  d.appendChild(b);
  d.append(` ${value}`);
  return d;
}

function buildCard(r: Receipt, cardWidth: number): HTMLDivElement {
  const card = document.createElement('div');
  card.style.cssText = `
    width:${cardWidth}px; border:1px solid #000; padding:12px;
    background:#fff; color:#000; font-size:11px; line-height:1.6;
    box-sizing:border-box; font-family:'Noto Sans KR',sans-serif;
  `;

  // Store name
  const store = document.createElement('div');
  store.style.cssText = `
    font-weight:700; font-size:14px; border-bottom:1px solid #000;
    padding-bottom:6px; margin-bottom:8px; text-align:center;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  `;
  store.textContent = r.store;
  card.appendChild(store);

  card.appendChild(row('결제일', `${r.date}${r.time ? ' ' + r.time : ''}`));
  card.appendChild(row('카드종류', r.cardName || ''));
  card.appendChild(row('카드 번호', r.cardNumber || ''));
  card.appendChild(row('승인번호', r.approvalNum || ''));
  card.appendChild(row('가맹점 번호', r.merchantNum || ''));

  // Items table
  if (r.items && r.items.length > 0) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:6px; font-size:9px; line-height:1.3;';

    const th = document.createElement('div');
    th.style.cssText = 'border-top:1px solid #000; border-bottom:1px solid #000; text-align:center; font-weight:700; padding:3px 0; margin-bottom:3px;';
    th.textContent = '상품 내역';
    wrap.appendChild(th);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid; grid-template-columns:1fr auto auto auto; gap:0 6px;';

    [['상품명', ''], ['단가', 'right'], ['수량', 'center'], ['금액', 'right']].forEach(([label, align]) => {
      const d = document.createElement('div');
      d.style.cssText = `font-weight:700; border-bottom:1px solid #ccc;${align ? ' text-align:' + align + ';' : ''}`;
      d.textContent = label;
      grid.appendChild(d);
    });

    r.items.forEach(item => {
      const cells: [string, string][] = [
        [item.name, 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap'],
        [item.unitPrice.toLocaleString(), 'text-align:right'],
        [String(item.qty), 'text-align:center'],
        [item.amount.toLocaleString(), 'text-align:right'],
      ];
      cells.forEach(([text, style]) => {
        const d = document.createElement('div');
        d.style.cssText = style;
        d.textContent = text;
        grid.appendChild(d);
      });
    });

    wrap.appendChild(grid);
    card.appendChild(wrap);
  }

  // Total amount
  const amt = document.createElement('div');
  amt.style.cssText = 'margin-top:8px; text-align:right; font-size:13px;';
  const amtB = document.createElement('span');
  amtB.style.fontWeight = '700';
  amtB.textContent = '승인 금액 :';
  amt.appendChild(amtB);
  amt.append(` ${r.amount.toLocaleString()} 원`);
  card.appendChild(amt);

  return card;
}

async function renderToPdf(container: HTMLElement): Promise<{ pdf: jsPDF; pageCount: number }> {
  const canvas = await html2canvas(container, {
    scale: SCALE,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const a4Hmm = 297;
  const a4Wmm = 210;
  // A4 height in canvas pixels (scaled)
  const pageHpx = Math.round(A4_H_PX * SCALE);
  const totalPages = Math.ceil(canvas.height / pageHpx);

  for (let p = 0; p < totalPages; p++) {
    if (p > 0) pdf.addPage();

    const srcY = p * pageHpx;
    const srcH = Math.min(pageHpx, canvas.height - srcY);

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = srcH;
    const ctx = pageCanvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

    const imgData = pageCanvas.toDataURL('image/jpeg', 0.92);
    // Height in mm proportional to how much of the A4 page is filled
    const imgHmm = (srcH / pageHpx) * a4Hmm;
    pdf.addImage(imgData, 'JPEG', 0, 0, a4Wmm, imgHmm);
  }

  return { pdf, pageCount: totalPages };
}

export async function exportEvidencePdf(
  expenses: Receipt[],
  docDate: string,
  cols = 3,
): Promise<void> {
  if (expenses.length === 0) {
    alert('저장할 영수증이 없습니다.');
    return;
  }

  await ensureNotoSansKR();

  const container = buildContainer(cols);
  const cardWidth = parseInt(container.dataset.cardWidth!);

  container.appendChild(buildTitle());

  const grid = document.createElement('div');
  grid.style.cssText = `
    display:grid;
    grid-template-columns:repeat(${cols}, ${cardWidth}px);
    gap:${GAP}px;
    align-items:start;
  `;

  expenses.forEach(r => grid.appendChild(buildCard(r, cardWidth)));
  container.appendChild(grid);
  document.body.appendChild(container);

  try {
    const { pdf } = await renderToPdf(container);
    pdf.save(`영수증모음_${docDate}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
