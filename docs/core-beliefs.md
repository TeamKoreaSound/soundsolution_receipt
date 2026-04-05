# Core Beliefs — 영수증 정리 (Receipt Hub)

> 이 문서는 AI 에이전트와 인간 개발자 모두가 따르는 운영 원칙입니다.

## 1. Single Source of Truth

상수, 타입, OCR 프롬프트는 **한 곳에서만 정의**합니다.
- 타입: `frontend/src/types/`
- 상수: frontend/src/shared/constants.ts (예정)
- 다른 파일은 import해서 사용

## 2. 작은 단위 원칙

- 프론트엔드 컴포넌트: 300줄 이하 (`tools/lint_frontend.py`가 경고)
- 함수: 한 가지 일만 수행
- 뷰(탭)는 별도 파일로 분리 (Dashboard / Preview / Evidence)

## 3. 문서는 코드의 일부

문서가 코드와 다르면 문서가 틀린 것입니다.
`tools/lint_docs.py`가 문서 신선도를 검사하고, 깨진 경로 참조를 찾습니다.
`docs/gardening-schedule.md`의 체크리스트를 따릅니다.

## 4. 기계적 강제 > 사람의 기억

규칙은 린터와 pre-commit hook으로 강제합니다.
"주의해서 코딩하세요"는 규칙이 아닙니다.

## 5. 사용자 데이터는 사용자 기기에서

백엔드 서버가 없으므로 모든 영수증 이미지·텍스트는 브라우저 localStorage에만 저장됩니다.
API 키는 `.env`(`VITE_GEMINI_API_KEY`) 또는 사용자의 localStorage에 저장.
**서버로 전송하지 않습니다** — Gemini API를 제외하고.

## 6. 점진적 개선

모든 것을 한 번에 완벽하게 만들 필요 없습니다.
`QUALITY_SCORE.md`로 현재 상태를 추적하고, Action Items의 우선순위에 따라 개선합니다.

## 7. Sprint Contract 우선

새 작업은 `directives/sprint_contract_template.md`를 복사하여
목표·완료 기준을 명시한 후 시작합니다. 완료된 계약서는 `docs/exec-plans/completed/`로 이동.
