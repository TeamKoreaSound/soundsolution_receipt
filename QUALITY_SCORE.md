# Quality Score — 영수증 정리 (Receipt Hub)

> Last updated: 2026-04-05

## 도메인별 등급

| 도메인 | 등급 | 근거 |
|--------|------|------|
| 코드 구조 | D | `frontend/src/App.tsx` 920줄 단일 파일, 컴포넌트 분리 미흡 |
| 타입 안전성 | B | TypeScript strict, `any` 제거 완료, 공유 타입 모듈 미구성 |
| 에러 처리 | C | try/catch + alert 중심, 사용자 친화적 에러 UI 없음 |
| 테스트 커버리지 | F | 테스트 없음 |
| 문서화 | B | AGENTS/ARCHITECTURE 등 기본 문서 구성 완료 |
| 보안 | C | API 키가 localStorage/VITE 환경변수에 노출, CVE 있는 xlsx 사용 |
| 배포 | N/A | 정적 빌드만 존재, 배포 설정 없음 |
| 모니터링 | N/A | 클라이언트 전용, 별도 모니터링 없음 |

## 등급 정의

| 등급 | 의미 |
|------|------|
| **A** | 프로덕션 수준, 모범 사례 적용 |
| **B** | 양호, 경미한 개선 필요 |
| **C** | 기능 동작하나 구조적 개선 필요 |
| **D** | 기술 부채 누적, 리팩토링 필요 |
| **F** | 미구현 또는 심각한 문제 |
| **N/A** | 미평가 |

## Action Items (우선순위순)

1. `frontend/src/App.tsx`를 Layer 1~3 기준으로 분할 (utils, components, views)
2. OCR 프롬프트·상수·localStorage 키를 공유 상수 모듈(frontend/src/shared/constants.ts)로 추출
3. `Receipt` 등 도메인 타입을 frontend/src/types/로 이동
4. 최소 단위 테스트 도입 (Vitest): `numberToKoreanAmt`, `resizeImage`
5. xlsx 라이브러리 CVE 대응 검토 (ExcelJS 등 대체 검토)
