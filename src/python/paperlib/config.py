"""Single place for paths, seeds, and parameters. Keep in sync with docs/methodology.md."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
FIGURES = ROOT / "figures"
RESULTS = ROOT / "results"
SEED = 0
