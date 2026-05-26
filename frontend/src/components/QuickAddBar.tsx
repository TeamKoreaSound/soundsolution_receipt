import type { QuickAddBarProps } from '../types';

export default function QuickAddBar({ quickAdd, setQuickAdd, onAdd, labelStore, labelNote }: QuickAddBarProps) {
  const inputStyle: React.CSSProperties = { fontSize: '13px', padding: '6px 10px' };
  return (
    <div className="preview-container-settings" style={{
      width: '850px', display: 'flex', gap: '8px', alignItems: 'flex-end',
      marginTop: '-8px', marginBottom: '16px', padding: '14px 16px',
      background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
    }}>
      <div className="flex-col" style={{ gap: '4px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>날짜</label>
        <input type="date" value={quickAdd.date} onChange={e => setQuickAdd({ ...quickAdd, date: e.target.value })} style={inputStyle} />
      </div>
      <div className="flex-col" style={{ gap: '4px', flex: 2 }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{labelStore}</label>
        <input type="text" value={quickAdd.store} onChange={e => setQuickAdd({ ...quickAdd, store: e.target.value })} style={inputStyle} />
      </div>
      <div className="flex-col" style={{ gap: '4px', flex: 1 }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>금액(원)</label>
        <input type="number" value={quickAdd.amount} onChange={e => setQuickAdd({ ...quickAdd, amount: e.target.value })} style={inputStyle} />
      </div>
      <div className="flex-col" style={{ gap: '4px', flex: 2 }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{labelNote}</label>
        <input type="text" value={quickAdd.note} onChange={e => setQuickAdd({ ...quickAdd, note: e.target.value })} style={inputStyle}
          onKeyDown={e => { if (e.key === 'Enter') onAdd(); }} />
      </div>
      <button className="btn-primary" onClick={onAdd} style={{ height: '34px', padding: '0 16px' }}>+ 추가</button>
    </div>
  );
}
