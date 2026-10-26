from paperlib import config, run


def test_reproduce_writes_figure(tmp_path, monkeypatch):
    # Write to a temp dir so tests never touch the repo's figures/ and results/.
    monkeypatch.setattr(config, "FIGURES", tmp_path / "figures")
    monkeypatch.setattr(config, "RESULTS", tmp_path / "results")
    run.main()
    assert (tmp_path / "figures" / "e1_step.pdf").exists()
    assert (tmp_path / "results" / "e1_step.csv").exists()
