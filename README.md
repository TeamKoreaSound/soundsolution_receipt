# 영수증 정리 (Receipt Hub)

영수증 이미지를 Gemini API로 OCR 분석하여 **지출결의서(.xlsx)**와
**영수증 증빙철(A4 인쇄)**을 자동 생성하는 React SPA.

## 빠른 시작

```bash
cd frontend
npm install

# .env 파일 생성 (루트 또는 frontend/)
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

npm run dev           # http://localhost:5173
npm run build
```

## 주요 기능

- 영수증 사진 드래그·드롭 업로드 → Gemini 2.5 Flash OCR
- 지출결의서 템플릿 자동 채움 (13건 단위 시트 분할)
- A4 인쇄용 증빙철 레이아웃
- localStorage 기반 작업 상태 유지 + 백업/복원 (확장자 .exp)

## 프로젝트 구조

```
├── AGENTS.md / CLAUDE.md / GEMINI.md   ← AI 에이전트 진입점
├── ARCHITECTURE.md                      ← 시스템 구조
├── QUALITY_SCORE.md                     ← 품질 등급 추적
├── frontend/                            ← React + Vite SPA
├── tools/                               ← 커스텀 린터
├── docs/                                ← 설계 문서
├── directives/                          ← 에이전트 지시 파일
└── scripts/                             ← PDF/XLS 분석 스크립트
```

자세한 내용은 [AGENTS.md](AGENTS.md)와 [ARCHITECTURE.md](ARCHITECTURE.md) 참조.

## Quality Gate

```bash
# 프론트엔드
cd frontend && npx tsc --noEmit && npx eslint src/ && npm run build

# 문서/구조
python3 tools/lint_frontend.py
python3 tools/lint_docs.py
```

## 기술 스택

- React 19, TypeScript, Vite 8
- `xlsx` (SheetJS) — Excel 템플릿 조작
- `@google/generative-ai` — Gemini OCR
- `lucide-react` — 아이콘
