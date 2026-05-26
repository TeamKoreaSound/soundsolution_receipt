import { FileText } from 'lucide-react';
import DocumentSettingsPanel from '../components/DocumentSettingsPanel';
import QuickAddBar from '../components/QuickAddBar';
import { isKoreanHoliday } from '../utils/holidays';
import { formatKoreanDateWithDow } from '../utils/formatters';
import type { Receipt } from '../types';

interface LunchPreviewViewProps {
  receipts: Receipt[];
  docDate: string; setDocDate: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  manager: string; setManager: (v: string) => void;
  settlementMonth: string; setSettlementMonth: (v: string) => void;
  itemsPerPage: number; setItemsPerPage: (v: number) => void;
  rowHeight: number; setRowHeight: (v: number) => void;
  quickAdd: { date: string; store: string; amount: string; note: string };
  setQuickAdd: (v: { date: string; store: string; amount: string; note: string }) => void;
  onAddQuickReceipt: () => void;
  onPrint: () => void;
}

export default function LunchPreviewView({
  receipts,
  docDate, setDocDate,
  department, setDepartment,
  manager, setManager,
  settlementMonth, setSettlementMonth,
  itemsPerPage, setItemsPerPage,
  rowHeight, setRowHeight,
  quickAdd, setQuickAdd,
  onAddQuickReceipt,
  onPrint,
}: LunchPreviewViewProps) {
  const expenses = receipts.filter(r => r.type === 'expense');

  // 정산월 기준으로 표 생성 (작성일자와 독립)
  const [smYearStr, smMonthStr] = (settlementMonth || '').split('-');
  const year = parseInt(smYearStr || (docDate.split('-')[0] || '2024'), 10);
  const month = parseInt(smMonthStr || (docDate.split('-')[1] || '1'), 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  // 지정 연/월과 일치하는 영수증만 집계
  type DayAgg = { stores: string[]; amount: number; notes: string[] };
  const byDay = new Map<number, DayAgg>();
  expenses.forEach(r => {
    const parts = (r.date || '').split('-');
    const ry = parseInt(parts[0] || '0', 10);
    const rm = parseInt(parts[1] || '0', 10);
    const rd = parseInt(parts[2] || '0', 10);
    if (ry !== year || rm !== month) return;
    if (rd < 1 || rd > daysInMonth) return;
    const agg = byDay.get(rd) || { stores: [], amount: 0, notes: [] };
    if (r.store) agg.stores.push(r.store);
    agg.amount += r.amount || 0;
    if (r.category && r.category.trim() !== '식비') agg.notes.push(r.category);
    byDay.set(rd, agg);
  });

  const totalAmount = Array.from(byDay.values()).reduce((s, a) => s + a.amount, 0);

  return (
    <div className="preview-container flex-col" style={{ alignItems: 'center' }}>
      <div className="flex-row" style={{ width: '850px', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button className="btn-primary" onClick={onPrint}>
          <FileText size={18} />
          현재 화면 PDF/A4 인쇄
        </button>
      </div>

      {/* Document Settings Panel */}
      <DocumentSettingsPanel
        className="preview-container-settings"
        width="850px"
        docDate={docDate} setDocDate={setDocDate}
        department={department} setDepartment={setDepartment}
        manager={manager} setManager={setManager}
        itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}
        rowHeight={rowHeight} setRowHeight={setRowHeight}
        showSettlementMonth={true}
        settlementMonth={settlementMonth} setSettlementMonth={setSettlementMonth}
      />

      <QuickAddBar quickAdd={quickAdd} setQuickAdd={setQuickAdd} onAdd={onAddQuickReceipt} labelStore="식 당 명" labelNote="비 고" />

      <div className="preview-paper">
        <div id="print-area">
          <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', letterSpacing: '6px', marginBottom: '30px', color: '#000' }}>
            {year}년 {month}월 식대 지출결의서
          </div>

          {/* 작성일자/부서/성명 + 결재란 (단일 테이블) — 원본 PDF 실측 비율 */}
          <table style={{ borderCollapse: 'collapse', fontSize: '13px', color: '#000', width: '100%', marginBottom: '24px', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '19.01%' }} />
              <col style={{ width: '35.17%' }} />
              <col style={{ width: '11.22%' }} />
              <col style={{ width: '11.41%' }} />
              <col style={{ width: '11.03%' }} />
              <col style={{ width: '12.16%' }} />
            </colgroup>
            <tbody>
              <tr style={{ height: '38px' }}>
                <td style={{ border: '1px solid #000', background: '#f0f0f0', fontWeight: 'bold', textAlign: 'center', letterSpacing: '4px' }}>작 성 일 자</td>
                <td style={{ border: '1px solid #000', padding: '0 14px' }}>{formatKoreanDateWithDow(docDate)}</td>
                <td rowSpan={3} style={{ border: '1px solid #000', background: '#f0f0f0', fontWeight: 'bold', textAlign: 'center', writingMode: 'vertical-rl', letterSpacing: '6px' }}>결 재</td>
                <td style={{ border: '1px solid #000', background: '#f0f0f0', fontWeight: 'bold', textAlign: 'center' }}>담 당</td>
                <td style={{ border: '1px solid #000', background: '#f0f0f0', fontWeight: 'bold', textAlign: 'center' }}>총 무</td>
                <td style={{ border: '1px solid #000', background: '#f0f0f0', fontWeight: 'bold', textAlign: 'center' }}>대표이사</td>
              </tr>
              <tr style={{ height: '38px' }}>
                <td style={{ border: '1px solid #000', background: '#f0f0f0', fontWeight: 'bold', textAlign: 'center', letterSpacing: '4px' }}>부 서</td>
                <td style={{ border: '1px solid #000', padding: '0 14px' }}>{department}</td>
                <td rowSpan={2} style={{ border: '1px solid #000' }}></td>
                <td rowSpan={2} style={{ border: '1px solid #000' }}></td>
                <td rowSpan={2} style={{ border: '1px solid #000' }}></td>
              </tr>
              <tr style={{ height: '38px' }}>
                <td style={{ border: '1px solid #000', background: '#f0f0f0', fontWeight: 'bold', textAlign: 'center', letterSpacing: '4px' }}>성 명</td>
                <td style={{ border: '1px solid #000', padding: '0 14px' }}>{manager}</td>
              </tr>
            </tbody>
          </table>

          {/* 본문 테이블 — 원본 PDF 실측 비율 */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#000', border: '2px solid #000', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '19.20%' }} />
              <col style={{ width: '34.98%' }} />
              <col style={{ width: '22.62%' }} />
              <col style={{ width: '23.20%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                <th style={{ border: '1px solid #000', padding: '8px' }}>날 짜</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>식 당 명</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>금 액</th>
                <th style={{ border: '1px solid #000', padding: '8px' }}>비 고</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dow = new Date(year, month - 1, day).getDay();
                const isWeekend = dow === 0 || dow === 6;
                const isHoliday = isKoreanHoliday(year, month, day);
                const agg = byDay.get(day);
                const dateColor = (isWeekend || isHoliday) ? '#d32f2f' : '#000';
                // 평일(주말·공휴일 아님)에 영수증 내역이 없으면 "도시락" 표기
                const isRegularWeekday = !isWeekend && !isHoliday;
                const storeText = agg ? agg.stores.join(', ') : (isRegularWeekday ? '도시락' : '');
                return (
                  <tr key={day} style={{ height: '22px' }}>
                    <td style={{ border: '1px solid #000', textAlign: 'center', color: dateColor, padding: '2px 6px' }}>
                      {year}년 {month}월 {day}일
                    </td>
                    <td style={{ border: '1px solid #000', textAlign: 'center', padding: '2px 6px' }}>{storeText}</td>
                    <td style={{ border: '1px solid #000', textAlign: 'right', padding: '2px 8px' }}>{agg && agg.amount > 0 ? agg.amount.toLocaleString() : ''}</td>
                    <td style={{ border: '1px solid #000', textAlign: 'center', padding: '2px 6px' }}>{agg ? agg.notes.join(', ') : ''}</td>
                  </tr>
                );
              })}
              <tr style={{ background: '#f0f0f0', fontWeight: 'bold', height: '32px' }}>
                <td colSpan={2} style={{ border: '1px solid #000', textAlign: 'center', fontSize: '15px' }}>합 계</td>
                <td style={{ border: '1px solid #000', textAlign: 'right', padding: '2px 8px', fontSize: '15px' }}>{totalAmount.toLocaleString()}</td>
                <td style={{ border: '1px solid #000' }}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
