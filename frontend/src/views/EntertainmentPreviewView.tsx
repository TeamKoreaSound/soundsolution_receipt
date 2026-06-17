import { FileText, Download } from 'lucide-react';
import DocumentSettingsPanel from '../components/DocumentSettingsPanel';
import { exportXlsx } from '../utils/exportXlsx';
import type { EntertainmentRecord } from '../types';

interface EntertainmentPreviewViewProps {
  entertainmentRecords: EntertainmentRecord[];
  docDate: string; setDocDate: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  manager: string; setManager: (v: string) => void;
  itemsPerPage: number; setItemsPerPage: (v: number) => void;
  rowHeight: number; setRowHeight: (v: number) => void;
  onPrint: () => void;
}

export default function EntertainmentPreviewView({
  entertainmentRecords,
  docDate, setDocDate,
  department, setDepartment,
  manager, setManager,
  itemsPerPage, setItemsPerPage,
  rowHeight, setRowHeight,
  onPrint,
}: EntertainmentPreviewViewProps) {
  const docYear = docDate.split('-')[0] || '';
  const docMonth = docDate.split('-')[1] || '';
  const docDay = docDate.split('-')[2] || '';

  const handleXlsxDownload = () => {
    exportXlsx([], entertainmentRecords, docDate, department, manager);
  };

  const approvalCols = ['담 당', '차장/부장', '전무/부사장', '총 무', '대표이사'];

  return (
    <div className="preview-container flex-col" style={{ alignItems: 'center' }}>
      <div className="flex-row" style={{ width: '850px', justifyContent: 'flex-end', marginBottom: '16px', gap: '12px' }}>
        <button
          className="btn-secondary"
          onClick={handleXlsxDownload}
          style={{ background: '#10b981', color: 'white', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Download size={18} /> xlsx 다운로드
        </button>
        <button className="btn-primary" onClick={onPrint}>
          <FileText size={18} /> 현재 화면 PDF/A4 인쇄
        </button>
      </div>

      <DocumentSettingsPanel
        className="preview-container-settings"
        width="850px"
        docDate={docDate} setDocDate={setDocDate}
        department={department} setDepartment={setDepartment}
        manager={manager} setManager={setManager}
        itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}
        rowHeight={rowHeight} setRowHeight={setRowHeight}
      />

      <div className="preview-paper">
        <div id="print-area">
          {/* 제목 */}
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
            접 대 사 유 서
          </div>

          {/* 결재란 + 기본 정보 테이블 */}
          <table className="excel-table" style={{ tableLayout: 'fixed', width: '100%', marginBottom: '0' }}>
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
                <td style={{ textAlign: 'left', paddingLeft: '24px' }}>{docDate}</td>
                <td rowSpan={3} style={{ background: '#d9d9d9', writingMode: 'vertical-rl', letterSpacing: '10px', fontWeight: 'bold' }}>결 재</td>
                {approvalCols.map(col => (
                  <td key={col} style={{ background: '#d9d9d9', fontWeight: 'bold' }}>{col}</td>
                ))}
              </tr>
              <tr className="approval-sign" style={{ height: '40px' }}>
                <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>부 서 명</td>
                <td style={{ textAlign: 'left', paddingLeft: '24px' }}>{department}</td>
                {approvalCols.map((_, i) => (
                  i === 0 ? <td key={i} rowSpan={2}></td> : <td key={i} rowSpan={2}></td>
                ))}
              </tr>
              <tr className="approval-box" style={{ height: '40px' }}>
                <td style={{ background: '#d9d9d9', fontWeight: 'bold' }}>담 당 자</td>
                <td style={{ textAlign: 'left', paddingLeft: '24px' }}>{manager}</td>
              </tr>
            </tbody>
          </table>

          {/* 접대사유서 내용 테이블 */}
          <table className="excel-table" style={{ tableLayout: 'fixed', width: '100%', marginTop: '24px' }}>
            <colgroup>
              <col style={{ width: '14%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '28%' }} />
            </colgroup>
            <tbody>
              <tr className="border-thick-bottom" style={{ background: '#d9d9d9', fontWeight: 'bold', height: '36px' }}>
                <td style={{ textAlign: 'center' }}>접 대 날 짜</td>
                <td style={{ textAlign: 'center' }}>접 대 처</td>
                <td style={{ textAlign: 'center' }}>인 원</td>
                <td style={{ textAlign: 'center' }}>사 용 처</td>
                <td style={{ textAlign: 'center' }}>금 액</td>
                <td style={{ textAlign: 'center' }}>사 유</td>
              </tr>
              {entertainmentRecords.map((er, i) => (
                <tr key={i} style={{ height: '33px' }}>
                  <td style={{ textAlign: 'center' }}>{er.date}</td>
                  <td style={{ textAlign: 'left', paddingLeft: '8px' }}>{er.counterpart}</td>
                  <td style={{ textAlign: 'center' }}>{er.headcount}</td>
                  <td style={{ textAlign: 'left', paddingLeft: '8px' }}>{er.place}</td>
                  <td style={{ textAlign: 'right', paddingRight: '8px' }}>{er.amount > 0 ? er.amount.toLocaleString() : ''}</td>
                  <td style={{ textAlign: 'left', paddingLeft: '8px' }}>{er.reason}</td>
                </tr>
              ))}
              {entertainmentRecords.length === 0 && (
                <tr style={{ height: '33px' }}>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#999' }}>내역 없음</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 하단 서명란 */}
          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#000' }}>
            <div style={{ marginBottom: '8px' }}>위와 같이 접대 사유를 보고합니다.</div>
            <div style={{ letterSpacing: '2px' }}>{docYear} 년 {docMonth} 월 {docDay} 일</div>
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', paddingRight: '80px', fontSize: '14px' }}>
              {manager} <span style={{ marginLeft: '20px' }}>(인)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
