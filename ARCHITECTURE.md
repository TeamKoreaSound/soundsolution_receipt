# Architecture — 영수증 정리 (Receipt Hub)

> Last updated: 2026-04-05

## 시스템 토폴로지

```
┌──────────────┐   파일 업로드    ┌────────────────┐   inline data   ┌──────────────┐
│  사용자       │ ────────────────▶│  React SPA     │ ───────────────▶│  Gemini API  │
│  (Browser)    │◀─────────────────│  (Vite)        │◀─── JSON ───────│  (2.5 Flash) │
└──────────────┘                   └────────────────┘                 └──────────────┘
                                           │
                                           │  Excel 템플릿 + 값 주입
                                           ▼
                                   ┌────────────────┐
                                   │  xlsx 라이브러리│
                                   └────────────────┘
                                           │
                                           ▼
                                   ┌────────────────┐
                                   │  지출결의서.xlsx │
                                   │  / PDF 인쇄     │
                                   └────────────────┘
```

- 백엔드 서버 없음. 모든 처리는 브라우저에서 수행
- API 키는 `.env`의 `VITE_GEMINI_API_KEY` 또는 localStorage에 저장
- 데이터 영속성: localStorage (`expense_workspace_*` 키)

## 의존성 레이어 (프론트엔드)

| Layer | 이름 | 모듈 예시 | 설명 |
|-------|------|-----------|------|
| 0 | Types | `src/types/` | 순수 타입 정의 |
| 1 | Utils | (예정) | OCR 프롬프트, 이미지 리사이즈, 숫자 변환 |
| 2 | Components | (예정) | `DocumentSettingsPanel` 등 재사용 UI |
| 3 | Views | `frontend/src/App.tsx` 내 render* | 탭별 화면 (Dashboard / Preview / Evidence) |
| 4 | Entry | `frontend/src/App.tsx`, `frontend/src/main.tsx` | 상태 관리, 라우팅 |

현재는 전부 `frontend/src/App.tsx` 단일 파일에 있으며, 300줄 제한 초과 중.
Layer 1~3은 점진적으로 분리 예정 (QUALITY_SCORE.md 참조).

## 포트 할당

| 포트 | 서비스 | 프로토콜 | 비고 |
|------|--------|----------|------|
| 5173 | Vite dev server | HTTP | `npm run dev` 기본값 |

## 데이터 플로우

```
영수증 이미지 업로드
  → fileToGenerativePart() (Base64 변환)
  → Gemini generateContent() (프롬프트 + 이미지)
  → JSON 파싱
  → resizeImage() (800px 제한, JPEG 0.6 품질)
  → setReceipts() → localStorage

Excel 내보내기
  → templateData (사용자 업로드) 또는 /template_2026.xls (기본)
  → XLSX.read() → sheet_add_aoa()로 셀 주입
  → 13건 단위 시트 분할 (지출결의서_1, 지출결의서_2, ...)
  → XLSX.writeFile()
```

## 배포 구조

정적 호스팅 (Vercel, Netlify, GitHub Pages 등)

```
frontend/
├── dist/              ← npm run build 산출물
│   ├── index.html
│   └── assets/
└── public/
    └── template_2026.xls  ← 기본 템플릿 (정적 자산)
```

## 핵심 제약

- **브라우저 전용**: 서버 사이드 비밀 저장 불가 → API 키는 사용자 환경에 의존
- **localStorage 용량 한계 (~5MB)**: 이미지 리사이즈 + quota 초과 시 텍스트만 저장
- **Gemini API 비용**: 각 영수증당 1회 호출, 사용자 API 키로 과금
- **오프라인 미지원**: OCR에 외부 API 필수
