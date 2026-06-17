import { Plus, Trash2 } from 'lucide-react';
import DocumentSettingsPanel from '../components/DocumentSettingsPanel';
import type { EntertainmentRecord } from '../types';

interface EntertainmentDashboardViewProps {
  entertainmentRecords: EntertainmentRecord[];
  docDate: string; setDocDate: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  manager: string; setManager: (v: string) => void;
  itemsPerPage: number; setItemsPerPage: (v: number) => void;
  rowHeight: number; setRowHeight: (v: number) => void;
  onAddRecord: () => void;
  onUpdateRecord: (id: string, field: keyof EntertainmentRecord, value: string | number) => void;
  onDeleteRecord: (id: string) => void;
}

export default function EntertainmentDashboardView({
  entertainmentRecords,
  docDate, setDocDate,
  department, setDepartment,
  manager, setManager,
  itemsPerPage, setItemsPerPage,
  rowHeight, setRowHeight,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
}: EntertainmentDashboardViewProps) {
  return (
    <div className="flex-col" style={{ gap: '24px' }}>
      <DocumentSettingsPanel
        docDate={docDate} setDocDate={setDocDate}
        department={department} setDepartment={setDepartment}
        manager={manager} setManager={setManager}
        itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}
        rowHeight={rowHeight} setRowHeight={setRowHeight}
      />

      <div className="glass-panel">
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <h3 className="flex-row">
            접대사유서 내역
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>({entertainmentRecords.length}건)</span>
          </h3>
          <button
            className="btn-secondary"
            onClick={onAddRecord}
            style={{ background: '#10b981', color: 'white', borderColor: '#10b981' }}
          >
            <Plus size={16} /> 항목 추가
          </button>
        </div>

        {entertainmentRecords.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>접대날짜</th>
                  <th>접대처</th>
                  <th>인원</th>
                  <th>사용처</th>
                  <th style={{ textAlign: 'right' }}>금액</th>
                  <th>사유</th>
                  <th style={{ textAlign: 'center', width: '50px' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {entertainmentRecords.map(er => (
                  <tr key={er.id}>
                    <td style={{ padding: '4px 8px', width: '13%' }}>
                      <input
                        type="text"
                        value={er.date}
                        onChange={e => onUpdateRecord(er.id, 'date', e.target.value)}
                        className="editable-cell"
                        style={{ textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ padding: '4px 8px', width: '18%' }}>
                      <input
                        type="text"
                        value={er.counterpart}
                        onChange={e => onUpdateRecord(er.id, 'counterpart', e.target.value)}
                        className="editable-cell"
                        placeholder="접대처 입력"
                      />
                    </td>
                    <td style={{ padding: '4px 8px', width: '10%' }}>
                      <input
                        type="text"
                        value={er.headcount}
                        onChange={e => onUpdateRecord(er.id, 'headcount', e.target.value)}
                        className="editable-cell"
                        placeholder="인원 수"
                        style={{ textAlign: 'center' }}
                      />
                    </td>
                    <td style={{ padding: '4px 8px' }}>
                      <input
                        type="text"
                        value={er.place}
                        onChange={e => onUpdateRecord(er.id, 'place', e.target.value)}
                        className="editable-cell"
                        placeholder="사용처 입력"
                      />
                    </td>
                    <td style={{ padding: '4px 8px', width: '14%', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <span style={{ marginRight: '2px', color: 'var(--text-muted)' }}>₩</span>
                        <input
                          type="text"
                          value={er.amount > 0 ? er.amount.toLocaleString() : ''}
                          onChange={e => onUpdateRecord(er.id, 'amount', parseInt(e.target.value.replace(/,/g, '')) || 0)}
                          className="editable-cell"
                          style={{ textAlign: 'right', width: '100px', fontWeight: 600 }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '4px 8px' }}>
                      <input
                        type="text"
                        value={er.reason}
                        onChange={e => onUpdateRecord(er.id, 'reason', e.target.value)}
                        className="editable-cell"
                        placeholder="접대 사유 입력"
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => onDeleteRecord(er.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="항목 삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            [항목 추가] 버튼을 눌러 접대사유서 내역을 입력해주세요.
          </div>
        )}
      </div>
    </div>
  );
}
