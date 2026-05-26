import type { Receipt, WorkflowMode } from '../types';
import { WORKFLOW_LABELS } from '../types';

type WorkspaceData = {
  receipts: Receipt[];
  docDate: string;
  department: string;
  manager: string;
  itemsPerPage: number;
  rowHeight: number;
  settlementMonth: string;
};

export const saveWorkspace = async (
  data: WorkspaceData,
  workflowMode: WorkflowMode,
): Promise<void> => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const periodTag = workflowMode === 'lunch' ? (data.settlementMonth || data.docDate) : data.docDate;
  const suggestedName = `${WORKFLOW_LABELS[workflowMode]}_작업상태_${periodTag}.exp`;

  // 최신 브라우저(Chrome/Edge): 저장 위치 선택 다이얼로그
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.showSaveFilePicker === 'function') {
    try {
      const handle = await w.showSaveFilePicker({
        suggestedName,
        types: [{ description: '영수증 작업파일 (.exp)', accept: { 'application/json': ['.exp', '.json'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err: unknown) {
      // 사용자가 취소한 경우 조용히 종료
      if (err instanceof Error && err.name === 'AbortError') return;
      console.warn('showSaveFilePicker 실패, 기본 다운로드로 대체:', err);
    }
  }

  // 구형 브라우저 폴백: 기본 다운로드 폴더로 저장
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = suggestedName;
  a.click();
  URL.revokeObjectURL(url);
};

export const parseWorkspaceFile = (
  content: string,
): Partial<WorkspaceData> => {
  const data = JSON.parse(content);
  const result: Partial<WorkspaceData> = {};
  if (data.receipts) result.receipts = data.receipts;
  if (data.docDate) result.docDate = data.docDate;
  if (data.department) result.department = data.department;
  if (data.manager) result.manager = data.manager;
  if (data.itemsPerPage) result.itemsPerPage = data.itemsPerPage;
  if (data.rowHeight) result.rowHeight = data.rowHeight;
  if (data.settlementMonth) result.settlementMonth = data.settlementMonth;
  return result;
};
