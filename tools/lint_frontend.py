#!/usr/bin/env python3
"""프론트엔드 컴포넌트 크기 제한 린터.

300줄을 초과하는 컴포넌트를 경고합니다.
큰 컴포넌트는 유지보수가 어렵고, 에이전트가 이해하기 힘듭니다.

사용법:
    python3 tools/lint_frontend.py

커스터마이즈:
    MAX_LINES: 줄 수 제한 (기본 300)
    FRONTEND_SRC: 검사 대상 디렉토리
"""

import sys
from pathlib import Path

MAX_LINES = 300
FRONTEND_SRC = Path(__file__).resolve().parent.parent / "frontend" / "src"


def main() -> int:
    if not FRONTEND_SRC.exists():
        print("frontend/src/ 디렉토리가 없습니다.")
        return 0

    warnings: list[str] = []

    for ext in ("*.tsx", "*.ts"):
        for f in sorted(FRONTEND_SRC.rglob(ext)):
            # 타입 파일은 제외
            if "/types/" in str(f):
                continue
            lines = f.read_text(encoding="utf-8").splitlines()
            if len(lines) > MAX_LINES:
                warnings.append(
                    f"  {f.relative_to(FRONTEND_SRC.parent)} — {len(lines)}줄 "
                    f"(제한: {MAX_LINES}줄)"
                )

    if warnings:
        print(f"lint_frontend: {len(warnings)}개 경고\n")
        print("\n".join(warnings))
        print(f"\n{MAX_LINES}줄 초과 컴포넌트는 분리를 권장합니다.")
        # 경고만 출력, 빌드는 통과 (exit 0)
        return 0

    print("lint_frontend: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
