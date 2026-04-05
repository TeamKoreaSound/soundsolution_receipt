# 영수증 정리 (Receipt Hub)

> 이 파일은 AI 에이전트가 프로젝트에 진입할 때 가장 먼저 읽는 지도입니다.
> ~100줄 이내로 유지하세요.

## 프로젝트 설명

영수증 이미지를 Gemini API로 OCR 분석하여 지출결의서(.xlsx)와
영수증 증빙철(PDF/A4 인쇄)을 자동 생성하는 React SPA입니다.

- 프론트엔드 전용, 백엔드 없음
- localStorage 기반 영속성
- 사용자 제공 Excel 템플릿을 읽어 시트에 값을 주입

## 핵심 파일 맵

| 파일/디렉토리 | 역할 | 비고 |
|---|---|---|
| `frontend/` | React + Vite + TypeScript SPA | 개발 서버: `cd frontend && npm run dev` |
| `frontend/src/App.tsx` | 메인 앱 컴포넌트 | 현재 모놀리식, 900+ 줄 |
| `frontend/src/types/` | 공유 타입 정의 | (예정) |
| `frontend/public/template_2026.xls` | 기본 지출결의서 템플릿 | 사용자 업로드로 교체 가능 |
| `tools/` | 커스텀 린터 | pre-commit 연동 |
| `docs/` | 설계 문서·운영 가이드 | |
| `docs/references/` | 원본 지출결의서 PDF/XLS | 참고용 |
| `directives/` | 에이전트 지시 파일 (sprint contract 등) | |
| `scripts/` | 일회성 분석 스크립트 | PDF/XLS 추출 등 |

## 문서 읽기 순서

1. `AGENTS.md` (이 파일) — 전체 지도
2. `ARCHITECTURE.md` — 시스템 구조, 데이터 플로우
3. `QUALITY_SCORE.md` — 현재 품질 등급, 우선 개선 항목
4. `docs/core-beliefs.md` — 운영 원칙
5. `docs/design-docs/` — 주요 설계 결정 기록

## 운영 원칙

1. **Single Source of Truth** — 상수·타입은 `frontend/src/types/`에서만 정의
2. **300줄 규칙** — 프론트엔드 컴포넌트는 300줄 이하 (`tools/lint_frontend.py`가 경고)
3. **문서 신선도** — 90일 이상 미수정 문서는 `tools/lint_docs.py`가 경고
4. **기계적 강제 > 사람의 기억** — 규칙은 린터와 pre-commit hook으로 강제
5. **점진적 개선** — `QUALITY_SCORE.md`로 현재 상태 추적, 우선순위대로 개선

## 디렉토리 구조

```
영수증 정리/
├── AGENTS.md / CLAUDE.md / GEMINI.md
├── ARCHITECTURE.md
├── QUALITY_SCORE.md
├── README.md
├── .pre-commit-config.yaml
├── frontend/
│   ├── src/
│   │   ├── App.tsx           ← 메인 컴포넌트
│   │   ├── main.tsx
│   │   ├── types/            ← 공유 타입 (예정)
│   │   └── *.css
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── tools/                    ← 커스텀 린터
│   ├── lint_frontend.py      ← 컴포넌트 300줄 제한
│   └── lint_docs.py          ← 문서 신선도 검사
├── docs/
│   ├── core-beliefs.md
│   ├── gardening-schedule.md
│   ├── design-docs/
│   ├── exec-plans/
│   └── references/           ← 지출결의서 원본 PDF/XLS
├── directives/               ← sprint_contract_template.md 등
└── scripts/                  ← PDF/XLS 분석 스크립트
```

## Quality Gate (커밋 전 체크리스트)

- [ ] `cd frontend && npx tsc --noEmit` — 타입 에러 없음
- [ ] `cd frontend && npx eslint src/` — 린트 에러 없음
- [ ] `cd frontend && npm run build` — 빌드 성공
- [ ] `python3 tools/lint_frontend.py` — 컴포넌트 크기 경고 확인
- [ ] `python3 tools/lint_docs.py` — 문서 신선도 경고 확인
