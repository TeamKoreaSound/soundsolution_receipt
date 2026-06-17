export type WorkflowMode = 'corp' | 'lunch' | 'entertainment';

export const WORKFLOW_LABELS: Record<WorkflowMode, string> = {
  lunch: '점심식대 지출증빙',
  corp: '법인카드 지출증빙',
  entertainment: '접대사유 지출증빙',
};

export const WORKFLOW_DEFAULTS: Record<WorkflowMode, { department: string; manager: string }> = {
  corp: { department: '', manager: '' },
  lunch: { department: '', manager: '' },
  entertainment: { department: '', manager: '' },
};

export interface EntertainmentRecord {
  id: string;
  receiptId?: string;
  date: string;
  counterpart: string;
  headcount: string;
  place: string;
  amount: number;
  reason: string;
}

export interface Receipt {
  id: string;
  date: string;
  store: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
  imageUrl?: string;
  time?: string;
  cardName?: string;
  cardNumber?: string;
  approvalNum?: string;
  installment?: string;
  merchantNum?: string;
  items?: { name: string; unitPrice: number; qty: number; amount: number }[];
}

export interface DocumentSettingsPanelProps {
  docDate: string;
  setDocDate: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  manager: string;
  setManager: (v: string) => void;
  itemsPerPage: number;
  setItemsPerPage: (v: number) => void;
  rowHeight: number;
  setRowHeight: (v: number) => void;
  width?: string;
  className?: string;
  showSettlementMonth?: boolean;
  settlementMonth?: string;
  setSettlementMonth?: (v: string) => void;
}

export interface QuickAddBarProps {
  quickAdd: { date: string; store: string; amount: string; note: string };
  setQuickAdd: (v: { date: string; store: string; amount: string; note: string }) => void;
  onAdd: () => void;
  labelStore: string;
  labelNote: string;
}
