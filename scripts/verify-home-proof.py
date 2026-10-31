#!/usr/bin/env python3
"""Fail closed unless two runs of all six home captures match each other and the goldens.

Run from the repository root after collecting the pinned Playwright JSON report:
  playwright test portfolio.spec.ts --grep 'home.*renders' --repeat-each=2 \
    --workers=1 --reporter=json > report.json
  python3 scripts/verify-home-proof.py report.json

A gzip-compressed JSON report is also accepted.

Uses only Python's standard library. Container paths are mapped back to this checkout.
"""

import base64
import gzip
import hashlib
import json
import sys
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def specifications(suites):
    for suite in suites:
        yield from suite.get("specs", [])
        yield from specifications(suite.get("suites", []))


def verify(report_path):
    root = Path.cwd()
    raw = report_path.read_bytes()
    report = json.loads(gzip.decompress(raw) if report_path.suffix == ".gz" else raw)
    assert not report.get("errors"), "Runner errors are not successful captures"
    stats = report["stats"]
    assert stats["expected"] == 12, stats
    assert all(stats[key] == 0 for key in ("unexpected", "flaky", "skipped")), stats
    captures = {}
    for spec in specifications(report["suites"]):
        name = spec["title"].removesuffix(" renders without visual regression")
        assert name in ("home", "home-pt", "home-es"), name
        for test in spec["tests"]:
            assert test["status"] == "expected", test["status"]
            key = f"{name}-{test['projectName']}"
            assert len(test["results"]) == 1, "Retries cannot prove stability"
            result = test["results"][0]
            assert result["status"] == "passed", result["status"]
            attachments = [
                item for item in result["attachments"]
                if item["name"] == f"{name}-settled" and item["contentType"] == "image/png"
            ]
            assert len(attachments) == 1, f"Missing capture: {key}"
            attachment = attachments[0]
            if "body" in attachment:
                capture_hash = hashlib.sha256(base64.b64decode(attachment["body"], validate=True)).hexdigest()
            else:
                path = Path(attachment["path"])
                if path.is_relative_to("/work"):
                    path = root / path.relative_to("/work")
                capture_hash = digest(path)
            captures.setdefault(key, []).append(capture_hash)
    expected = {f"{name}-{project}" for name in ("home", "home-pt", "home-es")
                for project in ("chromium-desktop", "mobile")}
    assert set(captures) == expected, "Missing locale/viewport"
    rows = []
    for key, hashes in sorted(captures.items()):
        golden = Path("tests/visual/portfolio.spec.ts-snapshots") / f"{key}.png"
        assert len(hashes) == 2 and len(set(hashes)) == 1, f"Unstable pixels: {key}"
        assert hashes[0] == digest(golden), f"Capture differs from golden: {key}"
        rows.append({"baseline": str(golden), "capture_sha256": hashes,
                     "baseline_sha256": digest(golden), "byte_identical": True})
    return {"status": "PASS", "runs": 12, "cases": rows,
            "oracle": "Two independent captures per locale/viewport, byte-identical to each other and the baseline; no retries"}


if __name__ == "__main__":
    assert len(sys.argv) == 2, "Usage: verify-home-proof.py <playwright-json-report>"
    print(json.dumps(verify(Path(sys.argv[1])), indent=2))
