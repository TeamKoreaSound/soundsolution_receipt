import { Fragment } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { Receipt, WorkflowMode } from '../types';

interface EvidenceViewProps {
  receipts: Receipt[];
  workflowMode: WorkflowMode;
  onPrint: () => void;
}

export default function EvidenceView({ receipts, workflowMode, onPrint }: EvidenceViewProps) {
  // 상호별로 카드종류/카드번호/가맹점번호가 채워진 영수증을 우선 찾아 lookup 맵 구성
  const storeInfoMap = new Map<string, { cardName?: string; cardNumber?: string; merchantNum?: string }>();
  receipts.forEach(r => {
    const key = (r.store || '').trim();
    if (!key) return;
    const existing = storeInfoMap.get(key) || {};
    if (!existing.cardName && r.cardName) existing.cardName = r.cardName;
    if (!existing.cardNumber && r.cardNumber) existing.cardNumber = r.cardNumber;
    if (!existing.merchantNum && r.merchantNum) existing.merchantNum = r.merchantNum;
    storeInfoMap.set(key, existing);
  });

  const expenses = receipts
    .filter(r => {
      // 영수증을 읽어들인 항목만 표시 (카드정보 또는 상품내역이 있는 경우) — type 무관
      const hasCardInfo = !!(r.cardName || r.cardNumber || r.approvalNum || r.merchantNum);
      const hasItems = !!(r.items && r.items.length > 0);
      if (!hasCardInfo && !hasItems) return false;
      // 점심식대 모드: "연차" 포함 항목 제외
      if (workflowMode === 'lunch') {
        const text = `${r.store || ''} ${r.category || ''}`.toLowerCase();
        if (text.includes('연차')) return false;
      }
      return true;
    })
    .slice()
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''))
    .map(r => {
      const fallback = storeInfoMap.get((r.store || '').trim()) || {};
      return {
        ...r,
        cardName: r.cardName || fallback.cardName || '',
        cardNumber: r.cardNumber || fallback.cardNumber || '',
        merchantNum: r.merchantNum || fallback.merchantNum || '',
      };
    });

  return (
    <div className="preview-container flex-col" style={{ alignItems: 'center' }}>
      <div className="flex-row" style={{ width: '850px', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button className="btn-primary" onClick={onPrint}>
          <ImageIcon size={18} />
          현재 화면 PDF/A4 인쇄
        </button>
      </div>

      <div className="preview-paper evidence-section">
        <h2 style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold', borderBottom: '3px solid black', paddingBottom: '20px', marginBottom: '40px', letterSpacing: '10px' }}>
          영 수 증 증 빙 철
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: workflowMode === 'corp' ? 'repeat(3, 1fr)' : 'repeat(auto-fill, 158px)', gridAutoRows: 'auto', gap: '16px', justifyContent: 'start', alignItems: 'start' }}>
          {expenses.length > 0 ? expenses.map((r, idx) => (
            <div key={'evidence-' + r.id + '-' + idx} style={{ padding: '0', breakInside: 'avoid', pageBreakInside: 'avoid', display: 'flex', flexDirection: 'column', width: '100%', minHeight: workflowMode === 'corp' ? '250px' : '200px' }}>

              {/* 텍스트 내용 (독립 박스) */}
              <div style={{ border: '1px solid #000', padding: '12px', backgroundColor: '#fff', color: '#000', fontFamily: 'sans-serif', fontSize: '11px', lineHeight: '1.6', flex: 1, boxSizing: 'border-box' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #000', paddingBottom: '6px', marginBottom: '8px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.store}
                </div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ fontWeight: 'bold', color: '#000' }}>결제일 :</span> {r.date} {r.time || ''}</div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ fontWeight: 'bold', color: '#000' }}>카드종류 :</span> {r.cardName || ''}</div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ fontWeight: 'bold', color: '#000' }}>카드 번호 :</span> {r.cardNumber || ''}</div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ fontWeight: 'bold', color: '#000' }}>승인번호 :</span> {r.approvalNum || ''}</div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ fontWeight: 'bold', color: '#000' }}>가맹점 번호 :</span> {r.merchantNum || ''}</div>
                {r.items && r.items.length > 0 && (
                  <div style={{ marginTop: '6px', fontSize: '9px', lineHeight: '1.3' }}>
                    <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 'bold', padding: '3px 0', marginBottom: '3px' }}>상품 내역</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0 6px', fontSize: '9px' }}>
                      <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '2px' }}>상품명</div>
                      <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '2px', textAlign: 'right' }}>단가</div>
                      <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '2px', textAlign: 'center' }}>수량</div>
                      <div style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '2px', textAlign: 'right' }}>금액</div>
                      {r.items.map((item, ii) => (
                        <Fragment key={ii}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ textAlign: 'right' }}>{item.unitPrice.toLocaleString()}</div>
                          <div style={{ textAlign: 'center' }}>{item.qty}</div>
                          <div style={{ textAlign: 'right' }}>{item.amount.toLocaleString()}</div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '8px', color: '#000', fontSize: '13px', textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold' }}>승인 금액 :</span> {r.amount.toLocaleString()} 원
                </div>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
              등록된 영수증 지출 내역이 없습니다.<br /><br />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
