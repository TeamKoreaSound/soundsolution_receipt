import { FileText } from 'lucide-react';
import DocumentSettingsPanel from '../components/DocumentSettingsPanel';
import QuickAddBar from '../components/QuickAddBar';
import { numberToKoreanAmt } from '../utils/formatters';
import { A4_MAX_ROWS } from '../utils/constants';
import type { Receipt } from '../types';

interface PreviewViewProps {
  receipts: Receipt[];
  docDate: string; setDocDate: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  manager: string; setManager: (v: string) => void;
  itemsPerPage: number; setItemsPerPage: (v: number) => void;
  rowHeight: number; setRowHeight: (v: number) => void;
  quickAdd: { date: string; store: string; amount: string; note: string };
  setQuickAdd: (v: { date: string; store: string; amount: string; note: string }) => void;
  onAddQuickReceipt: () => void;
  onPrint: () => void;
}

export default function PreviewView({
  receipts,
  docDate, setDocDate,
  department, setDepartment,
  manager, setManager,
  itemsPerPage, setItemsPerPage,
  rowHeight, setRowHeight,
  quickAdd, setQuickAdd,
  onAddQuickReceipt,
  onPrint,
}: PreviewViewProps) {
  // 법인카드(expense) + 현금(income) 모두 표시, 날짜순 정렬
  const expenses = receipts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const cardTotal = expenses.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const cashTotal = expenses.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalAmount = cardTotal + cashTotal;

  // A4 한 장에 헤더+푸터 제외 시 최대 ~13행. 데이터가 적으면 13행까지만 빈 행 채움.
  const MIN_ROWS = expenses.length <= A4_MAX_ROWS ? A4_MAX_ROWS : expenses.length;
  const pages = [expenses];
  const ITEMS_PER_PAGE = MIN_ROWS;

  const docYear = docDate.split('-')[0] || '';
  const docMonth = docDate.split('-')[1] || '';
  const docDay = docDate.split('-')[2] || '';

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
      />

      <QuickAddBar quickAdd={quickAdd} setQuickAdd={setQuickAdd} onAdd={onAddQuickReceipt} labelStore="사 용 처" labelNote="사 용 내 역" />

      <div className="preview-paper">
        <div id="print-area">
          {pages.map((pageExpenses, pageIndex) => {
            const emptyRows = Array.from({ length: Math.max(0, ITEMS_PER_PAGE - pageExpenses.length) });
            return (
              <div key={pageIndex} className="page-break" style={{
                pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
                marginBottom: pageIndex < pages.length - 1 ? '60px' : '0',
              }}>
                <div style={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  height: '84px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '8px',
                }}>
                  지 출 결 의 서
                </div>
                <table className="excel-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <colgroup>
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '4%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '12%' }} />
                  </colgroup>
                  <tbody>
                    <tr className="approval-box border-thick-top" style={{ height: '32px' }}>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>작 성 일 자</td>
                      <td style={{ textAlign: 'left', paddingLeft: '24px' }}>{docDate || '2026-04-04'}</td>
                      <td rowSpan={3} style={{ background: '#d9d9d9', writingMode: 'vertical-rl', letterSpacing: '10px', fontWeight: 'bold' }}>결 재</td>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>담 당</td>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>부장/이사</td>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>전무/부사장</td>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>총 무</td>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>대표이사</td>
                    </tr>
                    <tr className="approval-sign" style={{ height: '40px' }}>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>부 서</td>
                      <td style={{ textAlign: 'left', paddingLeft: '24px' }}>{department}</td>
                      <td rowSpan={2}></td>
                      <td rowSpan={2}></td>
                      <td rowSpan={2}></td>
                      <td rowSpan={2}></td>
                      <td rowSpan={2}></td>
                    </tr>
                    <tr className="approval-box" style={{ height: '40px' }}>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>담 당</td>
                      <td style={{ textAlign: 'left', paddingLeft: '24px' }}>{manager}</td>
                    </tr>
                    <tr className="approval-box border-thick-top" style={{ height: '53px' }}>
                      <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>합 계</td>
                      <td colSpan={5} className="center" style={{ fontWeight: '900', fontSize: '15px' }}>{numberToKoreanAmt(totalAmount)}</td>
                      <td colSpan={2} className="right" style={{ fontSize: '15px', fontWeight: 'bold' }}>₩{totalAmount.toLocaleString()}</td>
                    </tr>

                    <tr style={{ height: '24px', border: 'none' }}><td colSpan={8} style={{ border: 'none' }}></td></tr>

                    <tr className="border-thick-bottom" style={{ background: '#d9d9d9', fontWeight: 'bold', height: '36px' }}>
                      <td>사 용 일 자</td>
                      <td>사 용 처</td>
                      <td colSpan={4}>사 용 내 역</td>
                      <td>법 인 카 드</td>
                      <td>현 금</td>
                    </tr>
                    {pageExpenses.map((r, i) => (
                      <tr key={i} style={{ height: `${rowHeight}px` }}>
                        <td style={{ textAlign: 'center' }}>{r.date}</td>
                        <td style={{ textAlign: 'left', paddingLeft: '12px' }}>{r.store}</td>
                        <td colSpan={4} style={{ textAlign: 'left', paddingLeft: '12px' }}>{r.category}</td>
                        <td style={{ textAlign: 'right', paddingRight: '12px' }}>{r.type === 'expense' ? r.amount.toLocaleString() : ''}</td>
                        <td style={{ textAlign: 'right', paddingRight: '12px' }}>{r.type === 'income' ? r.amount.toLocaleString() : ''}</td>
                      </tr>
                    ))}
                    {emptyRows.map((_, i) => (
                      <tr key={'empty' + i} style={{ height: `${rowHeight}px` }}>
                        <td></td><td></td><td colSpan={4}></td><td></td><td></td>
                      </tr>
                    ))}
                    <tr className="border-thick-top" style={{ background: '#fdfdfd', height: '33px', fontWeight: 'bold' }}>
                      <td>소 계</td>
                      <td></td>
                      <td colSpan={4}></td>
                      <td style={{ textAlign: 'right', paddingRight: '12px' }}>{cardTotal.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', paddingRight: '12px' }}>{cashTotal.toLocaleString()}</td>
                    </tr>
                    <tr style={{ background: '#d9d9d9', height: '33px', fontWeight: 'bold' }}>
                      <td className="border-thick-top">합 계</td>
                      <td className="border-thick-top"></td>
                      <td colSpan={4} className="border-thick-top"></td>
                      <td className="border-thick-top" style={{ textAlign: 'right', paddingRight: '12px', fontSize: '15px' }}>{cardTotal.toLocaleString()}</td>
                      <td className="border-thick-top" style={{ textAlign: 'right', paddingRight: '12px', fontSize: '15px' }}>{cashTotal.toLocaleString()}</td>
                    </tr>
                    <tr style={{ height: '125px' }}>
                      <td colSpan={8} style={{ border: 'none', borderTop: '1px solid black', verticalAlign: 'middle', padding: '0 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                          <div style={{ fontSize: '18px' }}>위 금액을 청구 하오니 지급 바랍니다.</div>
                          <div style={{ fontSize: '15px', letterSpacing: '2px' }}>{docYear} 년 {docMonth} 월 {docDay} 일</div>
                          <div style={{ fontSize: '16px', width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '80px', marginTop: '-10px' }}>
                            {manager} <span style={{ marginLeft: '20px' }}>(인)</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
