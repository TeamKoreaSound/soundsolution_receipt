import * as XLSX from 'xlsx';
import type { Receipt, EntertainmentRecord } from '../types';

type CellRange = { s: { r: number; c: number }; e: { r: number; c: number } };

function wch(w: number) { return { wch: w }; }

export function exportXlsx(
  receipts: Receipt[],
  entertainmentRecords: EntertainmentRecord[],
  docDate: string,
  department: string,
  manager: string,
) {
  const wb = XLSX.utils.book_new();
  addExpenseSheet(wb, receipts, docDate, department, manager);

  const hasHigh = receipts.some(r => r.amount >= 100000);
  if (hasHigh || (receipts.length === 0 && entertainmentRecords.length > 0)) {
    addEntertainmentSheet(wb, entertainmentRecords, docDate, department, manager);
  }

  XLSX.writeFile(wb, `지출결의서_${docDate}.xlsx`);
}

function addExpenseSheet(
  wb: XLSX.WorkBook,
  receipts: Receipt[],
  docDate: string,
  department: string,
  manager: string,
) {
  const sorted = [...receipts].sort((a, b) => a.date.localeCompare(b.date));
  const cardTotal = sorted.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const cashTotal = sorted.filter(r => r.type !== 'expense').reduce((s, r) => s + r.amount, 0);
  const total = cardTotal + cashTotal;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const R: any[][] = [];
  R.push(['지출결의서', '', '', '', '', '', '', '']);
  R.push(['작성일자', docDate, '결재', '담당', '부장/이사', '전무/부사장', '총무', '대표이사']);
  R.push(['부서', department, '', '', '', '', '', '']);
  R.push(['담당', manager, '', '', '', '', '', '']);
  R.push(['합계', `일금 ${total.toLocaleString()}원정`, '', '', '', '', `₩${total.toLocaleString()}`, '']);
  R.push(['', '', '', '', '', '', '', '']);
  R.push(['사용일자', '사용처', '사용내역', '', '', '', '법인카드', '현금']);

  sorted.forEach(r => {
    R.push([
      r.date, r.store, r.category, '', '', '',
      r.type === 'expense' ? r.amount : '',
      r.type !== 'expense' ? r.amount : '',
    ]);
  });

  R.push(['소계', '', '', '', '', '', cardTotal, cashTotal]);
  R.push(['합계', '', '', '', '', '', cardTotal, cashTotal]);

  const ws = XLSX.utils.aoa_to_sheet(R);
  ws['!cols'] = [wch(14), wch(20), wch(18), wch(6), wch(6), wch(6), wch(14), wch(14)];

  const n = sorted.length;
  const merges: CellRange[] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 2 }, e: { r: 3, c: 2 } },
    { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
    { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
    { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } },
    { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } },
    { s: { r: 2, c: 7 }, e: { r: 3, c: 7 } },
    { s: { r: 4, c: 1 }, e: { r: 4, c: 5 } },
    { s: { r: 4, c: 6 }, e: { r: 4, c: 7 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 5 } },
  ];
  for (let i = 0; i < n; i++) {
    merges.push({ s: { r: 7 + i, c: 2 }, e: { r: 7 + i, c: 5 } });
  }
  merges.push({ s: { r: 7 + n, c: 1 }, e: { r: 7 + n, c: 5 } });
  merges.push({ s: { r: 8 + n, c: 1 }, e: { r: 8 + n, c: 5 } });

  ws['!merges'] = merges;
  XLSX.utils.book_append_sheet(wb, ws, '지출결의서');
}

function addEntertainmentSheet(
  wb: XLSX.WorkBook,
  records: EntertainmentRecord[],
  docDate: string,
  department: string,
  manager: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const R: any[][] = [];
  R.push(['접대사유서', '', '', '', '', '', '', '']);
  R.push(['작성일자', docDate, '결재', '담당', '차장/부장', '전무/부사장', '총무', '대표이사']);
  R.push(['부서명', department, '', '', '', '', '', '']);
  R.push(['담당자', manager, '', '', '', '', '', '']);
  R.push(['', '', '', '', '', '', '', '']);
  R.push(['접대날짜', '접대처', '인원', '사용처', '금액', '사유', '', '']);

  records.forEach(r => {
    R.push([r.date, r.counterpart, r.headcount, r.place, r.amount, r.reason, '', '']);
  });

  const ws = XLSX.utils.aoa_to_sheet(R);
  ws['!cols'] = [wch(14), wch(20), wch(8), wch(20), wch(14), wch(30), wch(6), wch(6)];

  const merges: CellRange[] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 2 }, e: { r: 3, c: 2 } },
    { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },
    { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },
    { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } },
    { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } },
    { s: { r: 2, c: 7 }, e: { r: 3, c: 7 } },
  ];

  ws['!merges'] = merges;
  XLSX.utils.book_append_sheet(wb, ws, '접대사유서');
}
