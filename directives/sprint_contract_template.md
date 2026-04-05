# Sprint Contract — {{TITLE}}

> 시작일: {{YYYY-MM-DD}}
> 예상 완료일: {{YYYY-MM-DD}}
> 담당: {{OWNER}}

## 목표 (Goal)

한 문장으로 이 스프린트가 달성하려는 것.

## 배경 (Context)

왜 지금 이 작업이 필요한가? 관련 QUALITY_SCORE 등급/Action Item 번호.

## 범위 (Scope)

### In scope
- [ ] 할 일 1
- [ ] 할 일 2

### Out of scope
- 다루지 않는 것 (명시)

## 완료 기준 (Definition of Done)

기능·품질 양쪽 모두 통과해야 완료로 간주합니다.

**기능**
- [ ] 사용자 시나리오 A가 동작함
- [ ] 사용자 시나리오 B가 동작함

**품질 게이트**
- [ ] `cd frontend && npx tsc --noEmit` PASS
- [ ] `cd frontend && npx eslint src/` 에러 0
- [ ] `cd frontend && npm run build` 성공
- [ ] `python3 tools/lint_frontend.py` 신규 경고 없음
- [ ] `python3 tools/lint_docs.py` 신규 경고 없음

**문서**
- [ ] 관련 파일 맵·아키텍처 문서 갱신
- [ ] 구조 변경 시 `docs/design-docs/`에 결정 기록 추가

## 리스크

| 리스크 | 완화 방법 |
|--------|-----------|
| | |

## 작업 완료 후

1. 모든 완료 기준 통과 확인
2. 이 파일을 `docs/exec-plans/completed/{YYYY-MM-DD}-{slug}.md`로 이동
3. `QUALITY_SCORE.md` 갱신 (등급 변화 반영)
