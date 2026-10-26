"""Entry point: regenerate every figure and result. `python -m paperlib.run`."""
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from control import step_response, tf

from . import config


def e1_step_response():
    """E1 placeholder: step response of a second-order plant. Replace with the real experiment."""
    t, y = step_response(tf([1], [1, 0.8, 1]), T=np.linspace(0, 20, 400))
    np.savetxt(config.RESULTS / "e1_step.csv", np.column_stack([t, y]), delimiter=",", header="t,y")
    fig, ax = plt.subplots(figsize=(3.4, 2.4))  # IEEE single-column width
    ax.plot(t, y)
    ax.set(xlabel="Time (s)", ylabel="Output")
    ax.grid(True)
    fig.tight_layout()
    fig.savefig(config.FIGURES / "e1_step.pdf")


def main():
    np.random.seed(config.SEED)
    config.FIGURES.mkdir(exist_ok=True)
    config.RESULTS.mkdir(exist_ok=True)
    e1_step_response()


if __name__ == "__main__":
    main()
