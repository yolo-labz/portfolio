from __future__ import annotations

import json
import logging
from collections import Counter
from pathlib import Path

from collector.config import MAX_LISTINGS
from collector.dedup import deduplicate, is_executive
from collector.models import JobsData
from collector.sources import fetch_all

logger = logging.getLogger(__name__)


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    # Import source modules to trigger registration
    import collector.sources.jsearch  # noqa: F401
    import collector.sources.adzuna  # noqa: F401
    import collector.sources.themuse  # noqa: F401
    import collector.sources.usajobs  # noqa: F401

    # Fetch from all registered sources
    raw_jobs = fetch_all()
    total_fetched = len(raw_jobs)
    logger.info(f"Total fetched from all sources: {total_fetched}")

    # Filter to executive-only
    executive_jobs = [j for j in raw_jobs if is_executive(j.title)]

    # Deduplicate
    unique_jobs = deduplicate(executive_jobs)
    after_dedup = len(unique_jobs)
    logger.info(f"After dedup: {after_dedup}")

    # Sort by posted_at descending (None values last)
    unique_jobs.sort(
        key=lambda j: (j.posted_at is not None, j.posted_at or ""),
        reverse=True,
    )

    # Prune to MAX_LISTINGS
    pruned_jobs = unique_jobs[:MAX_LISTINGS]
    logger.info(f"After prune (max {MAX_LISTINGS}): {len(pruned_jobs)}")

    # Build output
    jobs_data = JobsData.build(pruned_jobs)

    # Write atomically
    output_dir = Path(__file__).resolve().parent.parent / "data"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / "jobs.json"
    tmp_file = output_dir / "jobs.json.tmp"

    tmp_file.write_text(
        json.dumps(jobs_data.model_dump(mode="json"), indent=2, default=str),
        encoding="utf-8",
    )
    tmp_file.rename(output_file)

    # Summary
    source_counts = Counter(j.source for j in pruned_jobs)
    logger.info(
        f"Summary: fetched={total_fetched}, after_dedup={after_dedup}, "
        f"final={len(pruned_jobs)}, sources={dict(source_counts)}"
    )
    logger.info(f"Written to {output_file}")


if __name__ == "__main__":
    main()
