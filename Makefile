.PHONY: paper watch check env test lint matlab matlab-test reproduce init clean

# Use the project venv if `make env` created one (Windows: Scripts, else bin).
VENV_PY := $(firstword $(wildcard .venv/Scripts/python.exe .venv/bin/python))
PY      := $(if $(VENV_PY),$(VENV_PY),python)

paper:
	cd writeup && latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex

watch:
	cd writeup && latexmk -pdf -pvc main.tex

# Fails on undefined citations/references. Run after `make paper`.
check:
	@! grep -E "undefined|Citation .* undefined|Reference .* undefined" writeup/main.log

env:
	python -m venv .venv
	$(or $(wildcard .venv/Scripts/python.exe),.venv/bin/python) -m pip install -e "src/python[dev]"

test:
	$(PY) -m pytest

lint:
	$(PY) -m ruff check src tests

matlab:
	matlab -batch "run('src/matlab/run_all.m')"

matlab-test:
	matlab -batch "exit(~all([runtests('tests/matlab').Passed]))"

# ponytail: edit to your toolchain; `make init TOOL=python|matlab` deletes the other one.
reproduce:
	$(PY) -m paperlib.run
	# matlab -batch "run('src/matlab/run_all.m')"

# One-time: keep one toolchain, remove the other (destructive; do it before your first commit).
init:
	@test "$(TOOL)" = python -o "$(TOOL)" = matlab || { echo "usage: make init TOOL=python|matlab"; exit 1; }
	@if [ "$(TOOL)" = python ]; then rm -rf src/matlab tests/matlab .github/workflows/matlab.yml; else rm -rf src/python tests/test_smoke.py .github/workflows/python.yml; fi
	@echo "Kept $(TOOL). Now edit the 'reproduce' target in the Makefile."

clean:
	cd writeup && latexmk -C
