import type { DocumentSettingsPanelProps } from '../types';

export default function DocumentSettingsPanel({
  docDate, setDocDate, department, setDepartment, manager, setManager,
  itemsPerPage, setItemsPerPage, rowHeight, setRowHeight, width, className,
  showSettlementMonth, settlementMonth, setSettlementMonth,
}: DocumentSettingsPanelProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bg-card)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-highlight)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        ...(width ? { width } : {}),
      }}
    >
      <div className="flex-col" style={{gap: '8px', flex: 1}}>
        <label style={{fontSize: '13px', color: 'var(--text-secondary)'}}>작성일자</label>
        <input type="date" value={docDate} onChange={e => setDocDate(e.target.value)} />
      </div>
      <div className="flex-col" style={{gap: '8px', flex: 1}}>
        <label style={{fontSize: '13px', color: 'var(--text-secondary)'}}>부서명</label>
        <input type="text" placeholder="예: 개발팀" value={department} onChange={e => setDepartment(e.target.value)} />
      </div>
      <div className="flex-col" style={{gap: '8px', flex: 1}}>
        <label style={{fontSize: '13px', color: 'var(--text-secondary)'}}>제출자 (담당)</label>
        <input type="text" placeholder="예: 홍길동 대리" value={manager} onChange={e => setManager(e.target.value)} />
      </div>
      {showSettlementMonth && setSettlementMonth ? (
        <div className="flex-col" style={{gap: '8px', flex: 1}}>
          <label style={{fontSize: '13px', color: 'var(--text-secondary)'}}>식대 정산월</label>
          <input type="month" value={settlementMonth || ''} onChange={e => setSettlementMonth(e.target.value)} />
        </div>
      ) : (
        <div className="flex-col" style={{gap: '8px', flex: 1}}>
          <label style={{fontSize: '13px', color: 'var(--text-secondary)'}}>1페이지당 개수</label>
          <input type="number" value={itemsPerPage} onChange={e => setItemsPerPage(parseInt(e.target.value) || 17)} min={1} max={60} />
        </div>
      )}
      {!showSettlementMonth && (
        <div className="flex-col" style={{gap: '8px', flex: 1}}>
          <label style={{fontSize: '13px', color: 'var(--text-secondary)'}}>내역 줄 높이(px)</label>
          <input type="number" value={rowHeight} onChange={e => setRowHeight(parseInt(e.target.value) || 33)} min={10} max={100} />
        </div>
      )}
    </div>
  );
}
