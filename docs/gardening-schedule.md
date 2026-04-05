# Doc Gardening Schedule

## 매 PR/코드 변경 시 (에이전트 자동 체크)
- [ ] `cd frontend && npx tsc --noEmit` 통과
- [ ] `cd frontend && npx eslint src/` 통과
- [ ] `cd frontend && npm run build` 성공
- [ ] `tools/lint_frontend.py` 경고 확인
- [ ] `tools/lint_docs.py` 경고 확인

## 주간 (Weekly)
- [ ] `QUALITY_SCORE.md`의 "Last updated" 날짜가 14일 이내인지 확인
- [ ] `docs/exec-plans/active/`에 30일 이상 된 계획이 있으면 completed/로 이동 또는 갱신

## 월간 (Monthly)
- [ ] `directives/` 내 문서가 현재 코드와 일치하는지 검토
- [ ] `AGENTS.md` 파일 맵 테이블이 실제 파일 구조와 일치하는지 검토
- [ ] `ARCHITECTURE.md` 데이터 플로우가 실제 코드와 일치하는지 검토
- [ ] `docs/design-docs/`에 미작성된 주요 설계 결정이 있는지 확인

## 구조 변경 시 (On Structural Changes)
- [ ] `ARCHITECTURE.md` 레이어·토폴로지 업데이트
- [ ] `AGENTS.md` 파일 맵 테이블 업데이트
- [ ] `QUALITY_SCORE.md` 등급 재평가 및 Action Items 갱신
- [ ] `docs/design-docs/` 에 결정 기록 추가
