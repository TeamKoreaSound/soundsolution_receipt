#!/usr/bin/env python3
"""문서 신선도 검사 린터.

- 활성 실행 계획이 90일 이상 된 경우 경고
- QUALITY_SCORE.md가 90일 이상 미수정인 경우 경고
- 마크다운 파일의 경로 참조가 실제 존재하는지 검사

사용법:
    python3 tools/lint_docs.py

커스터마이즈:
    STALE_DAYS: 신선도 기준 일수 (기본 90)
"""

import re
import sys
import time
from pathlib import Path

STALE_DAYS = 90
ROOT = Path(__file__).resolve().parent.parent
STALE_SECONDS = STALE_DAYS * 86400


def check_exec_plans() -> list[str]:
    """활성 실행 계획의 나이를 검사."""
    warnings = []
    active_dir = ROOT / "docs" / "exec-plans" / "active"
    if not active_dir.exists():
        return warnings

    now = time.time()
    for f in sorted(active_dir.glob("*.md")):
        age_days = (now - f.stat().st_mtime) / 86400
        if age_days > STALE_DAYS:
            warnings.append(
                f"  {f.relative_to(ROOT)} — {int(age_days)}일 경과 "
                f"(completed/로 이동하거나 갱신하세요)"
            )
    return warnings


def check_quality_score() -> list[str]:
    """QUALITY_SCORE.md 신선도 검사."""
    warnings = []
    qs = ROOT / "QUALITY_SCORE.md"
    if not qs.exists():
        return warnings

    age_days = (time.time() - qs.stat().st_mtime) / 86400
    if age_days > STALE_DAYS:
        warnings.append(
            f"  QUALITY_SCORE.md — {int(age_days)}일 미수정 (갱신하세요)"
        )
    return warnings


def check_broken_refs() -> list[str]:
    """마크다운 파일의 경로 참조 검사."""
    warnings = []
    ref_pattern = re.compile(r"`([a-zA-Z0-9_./-]+(?:\.[a-zA-Z]+)?)`")

    for md_file in sorted(ROOT.rglob("*.md")):
        if "_archive" in str(md_file) or "node_modules" in str(md_file):
            continue
        try:
            content = md_file.read_text(encoding="utf-8")
        except (UnicodeDecodeError, PermissionError):
            continue

        for match in ref_pattern.finditer(content):
            ref_path = match.group(1)
            # 글로브 패턴 건너뛰기
            if "*" in ref_path or "?" in ref_path:
                continue
            # 확장자가 있는 파일 참조만 검사
            if "." not in ref_path.split("/")[-1]:
                continue
            # 상대 경로 무시
            if ref_path.startswith("http") or ref_path.startswith("#"):
                continue

            full_path = ROOT / ref_path
            if not full_path.exists():
                warnings.append(
                    f"  {md_file.relative_to(ROOT)} → `{ref_path}` (파일 없음)"
                )
    return warnings


def main() -> int:
    all_warnings: list[str] = []
    all_warnings.extend(check_exec_plans())
    all_warnings.extend(check_quality_score())
    all_warnings.extend(check_broken_refs())

    if all_warnings:
        print(f"lint_docs: {len(all_warnings)}개 경고\n")
        print("\n".join(all_warnings))
        return 0  # 경고만, 빌드 차단하지 않음

    print("lint_docs: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
