#!/usr/bin/env python3
"""Portfolio-side half of the org share-card rule.

WHY THIS EXISTS ON ITS OWN: the rule is not owned here. `yolo-labz/.github` holds
the policy (`profile/assets/brand/share-cards.json`), the canonical card and the
checker that audits the live org (`scripts/check-profile.py share-cards`). What
that checker cannot do is see a pull request: it reads `repos/<repo>/contents/...`
on the default branch, so a PR that ships a wrong 1200x630 card would be waved
through and only fail after merge — on a site that deploys on merge.

So the portfolio checks the half it can see — the card in *this* tree — against
the same pinned policy, and the upstream checker still runs end-to-end on main
and weekly for the published state. One policy, one implementation of "is this a
1200x630 PNG": `image_facts` is imported from the pinned checker, never copied.

Exit codes: 0 pass, 1 policy violation, 2 the check could not run at all.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

POLICY = "profile/assets/brand/share-cards.json"
CHECKER = "scripts/check-profile.py"


def fail(message: str) -> int:
    print(f"share-card: {message}", file=sys.stderr)
    return 2


def load_image_facts(org_root: Path):
    """Import `image_facts` from the pinned checker instead of re-implementing it."""
    source = org_root / CHECKER
    if not source.is_file():
        raise FileNotFoundError(source)
    spec = importlib.util.spec_from_file_location("org_check_profile", source)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    # dataclasses resolves `cls.__module__` through sys.modules, so the module has
    # to be registered before it is executed — otherwise the checker's @dataclass
    # definitions raise AttributeError on Python 3.14.
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module.image_facts


def last_change(repo_root: Path, path: str) -> str:
    """Committer date of the newest commit touching `path`, ISO-8601 UTC.

    Returns "" when git cannot answer (shallow clone missing history, or the
    path was never committed). An unknown date is not evidence of staleness, so
    the caller skips the comparison rather than inventing one.
    """
    try:
        done = subprocess.run(
            ["git", "-C", str(repo_root), "log", "-1", "--format=%cI", "--", path],
            capture_output=True,
            text=True,
            timeout=30,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired):
        return ""
    return done.stdout.strip() if done.returncode == 0 else ""


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(prog="check-share-card")
    parser.add_argument(
        "--org",
        default=".org-github",
        help="checkout of yolo-labz/.github at the pinned ref (holds the policy)",
    )
    parser.add_argument(
        "--family",
        default="yolo-labz/portfolio",
        help="policy family to validate against this tree",
    )
    parser.add_argument(
        "--root",
        default=".",
        help="this repository's checkout (the card is read from here)",
    )
    args = parser.parse_args(argv)

    org_root = Path(args.org).resolve()
    root = Path(args.root).resolve()

    policy_file = org_root / POLICY
    if not policy_file.is_file():
        return fail(f"no {POLICY} in {org_root} — the pinned .github checkout is missing")
    try:
        image_facts = load_image_facts(org_root)
    except (FileNotFoundError, ImportError) as exc:
        return fail(f"cannot import image_facts from the pinned checker: {exc}")

    policy = json.loads(policy_file.read_text(encoding="utf-8"))
    families = {fam["repo"]: fam for fam in policy["families"]}
    fam = families.get(args.family)
    if fam is None:
        return fail(
            f"{args.family} is not a family in {POLICY} "
            f"(has: {', '.join(sorted(families))}) — the policy moved, not this repo"
        )

    card_path = root / fam["image"]
    if not card_path.is_file():
        print(f"share-card: FAIL {fam['name']}: {fam['image']} does not exist", file=sys.stderr)
        return 1

    facts = image_facts(card_path.read_bytes())
    if facts is None:
        print(f"share-card: FAIL {fam['name']}: {fam['image']} is not a readable PNG/JPEG", file=sys.stderr)
        return 1
    declared = (fam["mime"], fam["width"], fam["height"])
    if facts != declared:
        print(
            f"share-card: FAIL {fam['name']}: {fam['image']} is "
            f"{facts[0]} {facts[1]}x{facts[2]}, policy declares "
            f"{declared[0]} {declared[1]}x{declared[2]}",
            file=sys.stderr,
        )
        return 1

    canon = policy["canonical"]
    if (fam["repo"], fam["image"]) != (canon["repo"], canon["path"]):
        mine = last_change(root, fam["image"])
        theirs = last_change(org_root, canon["path"])
        if mine and theirs and mine < theirs:
            print(
                f"share-card: FAIL {fam['name']}: stale — {fam['image']} last changed "
                f"{mine}, the canonical card {canon['path']} changed {theirs}",
                file=sys.stderr,
            )
            return 1
        if not (mine and theirs):
            print(
                f"share-card: note {fam['name']}: staleness not compared "
                f"(mine={mine or 'unknown'}, canonical={theirs or 'unknown'})"
            )
    else:
        print("share-card: note canonical family — staleness does not apply")

    print(
        f"share-card: PASS {fam['name']} {fam['image']} = "
        f"{facts[0]} {facts[1]}x{facts[2]} per {POLICY} "
        f"(pinned .github {last_change(org_root, 'profile/assets/brand/share-cards.json') or 'HEAD'})"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
