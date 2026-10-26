# MATLAB Style Guide & Templates

## Table of Contents
1. [File Header Template](#1-file-header-template)
2. [Naming Conventions](#2-naming-conventions)
3. [Publication-Quality Plot Template](#3-publication-quality-plot-template)
4. [Results Saving Pattern](#4-results-saving-pattern)
5. [Soft Computing Templates](#5-soft-computing-templates)
6. [Control Metrics Functions](#6-control-metrics-functions)

---

## 1. File Header Template

Every `.m` file (script or function) starts with this header:

```matlab
% =========================================================================
% <FILENAME>.m
% <One-line description of what this file does>
%
% Author   : [Researcher Name]
% Project  : UGV Soft Computing — KFUPM PhD Research
% Created  : <YYYY-MM-DD>
% Modified : <YYYY-MM-DD>
%
% Description:
%   <2–4 sentences. What system is modeled, what algorithm is used,
%    what this file specifically contributes to the pipeline.>
%
% Inputs:
%   p  — parameter struct from params.m
%   [other inputs with types and units]
%
% Outputs:
%   [output name]  — [type, units, description]
%
% Dependencies:
%   params.m, [list other .m files or toolboxes]
%
% Usage:
%   p = params();
%   results = <function_name>(p);
% =========================================================================
```

---

## 2. Naming Conventions

### Variables
| Pattern | Example | Meaning |
|---------|---------|---------|
| `name_unit` | `vel_mps`, `angle_rad`, `force_N` | Physical quantity with unit suffix |
| `p.field` | `p.mass_kg`, `p.Kp` | Parameter struct field |
| `t_s` | `t_s` | Time vector in seconds |
| `n_X` | `n_particles`, `n_iter` | Count of something |
| `is_X` | `is_converged`, `is_saturated` | Boolean flag |
| `idx_X` | `idx_best`, `idx_start` | Index variable |
| `X_prev`, `X_curr` | `pos_prev`, `pos_curr` | Temporal states |

### Functions
```
compute_<metric>   → compute_overshoot, compute_rise_time
build_<thing>      → build_model, build_fis
plot_<thing>       → plot_response, plot_membership_functions
run_<thing>        → run_simulation, run_pso
load_<thing>       → load_params, load_trained_net
save_<thing>       → save_results, save_figures
```

### Files
```
params.m           → always this name, always returns struct p
main.m             → always this name, entry point
build_model.m      → Simulink builder
analyze.m          → post-processing
plot_results.m     → all figure generation
```

---

## 3. Publication-Quality Plot Template

```matlab
function plot_results(results, p)
% PLOT_RESULTS  Generate publication-quality figures from simulation results.
%   Figures are saved as .png and .pdf to plots/ directory.

    %% ---- Global figure settings ----
    set(groot, 'defaultAxesFontSize',   12);
    set(groot, 'defaultAxesFontName',   'Times New Roman');
    set(groot, 'defaultLineLineWidth',   1.5);
    set(groot, 'defaultAxesLineWidth',   1.0);
    set(groot, 'defaultAxesBox',         'on');
    set(groot, 'defaultAxesXGrid',       'on');
    set(groot, 'defaultAxesYGrid',       'on');

    % Standard figure size for journal papers (column width ≈ 8.5 cm)
    fig_w_cm = 16;   % full-page width
    fig_h_cm = 10;

    %% ---- Figure 1: Step response ----
    fig1 = figure('Name', 'Step Response', 'NumberTitle', 'off');
    set(fig1, 'Units', 'centimeters', 'Position', [2 2 fig_w_cm fig_h_cm]);

    plot(results.t, results.y,      'b-',  'DisplayName', 'System output');
    hold on;
    plot(results.t, ones(size(results.t)), 'k--', 'DisplayName', 'Reference');
    hold off;

    xlabel('Time (s)',       'FontSize', 12, 'FontName', 'Times New Roman');
    ylabel('Velocity (m/s)', 'FontSize', 12, 'FontName', 'Times New Roman');
    title('Step Response',   'FontSize', 13, 'FontName', 'Times New Roman', 'FontWeight', 'bold');
    legend('Location', 'southeast', 'FontSize', 11);
    xlim([0 results.t(end)]);

    % Annotate key metrics on the plot
    text(results.rise_time, 0.9, sprintf('T_r = %.2f s', results.rise_time), ...
        'FontSize', 10, 'Color', [0.2 0.2 0.8]);

    %% ---- Export ----
    export_figure(fig1, 'plots/step_response');

    fprintf('Figures saved to plots/\n');
end

% ---- Helper: export as both PNG and PDF ----
function export_figure(fig, filepath)
    % PNG for quick viewing
    print(fig, [filepath '.png'], '-dpng', '-r300');
    % PDF for LaTeX inclusion (vector, lossless)
    print(fig, [filepath '.pdf'], '-dpdf', '-bestfit');
end
```

### Multi-panel figure template
```matlab
fig = figure('Units','centimeters','Position',[2 2 18 12]);

subplot(2,2,1);
plot(t, e); xlabel('Time (s)'); ylabel('Error'); title('Tracking Error');

subplot(2,2,2);
plot(t, u); xlabel('Time (s)'); ylabel('Control input u'); title('Control Effort');

subplot(2,2,3);
plot(t, y); xlabel('Time (s)'); ylabel('Output y'); title('System Response');

subplot(2,2,4);
bar(categorical({'Rise','Settle','Overshoot'}), [Tr Ts Os]);
ylabel('Value'); title('Performance Metrics');

sgtitle('Simulation Results — <System Name>', 'FontSize', 13, 'FontWeight', 'bold');
```

---

## 4. Results Saving Pattern

```matlab
% Save workspace results
save('results/results.mat', 'results', 'p');

% Save tabular metrics to CSV (for LaTeX or Excel)
metrics = struct();
metrics.rise_time_s    = results.rise_time;
metrics.settle_time_s  = results.settle_time;
metrics.overshoot_pct  = results.overshoot;
metrics.sse            = results.sse;
metrics.ITAE           = results.ITAE;

T = struct2table(metrics);
writetable(T, 'results/metrics.csv');

% Save time-series data (for external plotting or sharing)
data = [results.t(:), results.y(:), results.u(:)];
headers = {'time_s', 'output_y', 'control_u'};
T_ts = array2table(data, 'VariableNames', headers);
writetable(T_ts, 'results/timeseries.csv');
```

---

## 5. Soft Computing Templates

### Fuzzy Inference System (FIS) — Build programmatically
```matlab
function fis = build_fis(p)
% BUILD_FIS  Construct a Mamdani FIS for UGV speed/heading control.

    fis = mamfis('Name', 'UGV_FuzzyController', ...
                 'AndMethod',          'min',   ...
                 'OrMethod',           'max',   ...
                 'ImplicationMethod',  'min',   ...
                 'AggregationMethod',  'max',   ...
                 'DefuzzificationMethod', 'centroid');

    %% Inputs
    fis = addInput(fis, [-p.e_max  p.e_max], 'Name', 'error');
    fis = addInput(fis, [-p.de_max p.de_max], 'Name', 'd_error');

    %% Output
    fis = addOutput(fis, [p.u_min p.u_max], 'Name', 'u');

    %% Membership functions — input 1 (error)
    fis = addMF(fis, 'error', 'trimf', [-p.e_max -p.e_max 0], 'Name', 'NB');
    fis = addMF(fis, 'error', 'trimf', [-p.e_max 0       0], 'Name', 'NM');
    fis = addMF(fis, 'trimf', [name not needed here]); % continue for NS, ZE, PS, PM, PB

    %% Rules (use ruleList format: [in1 in2 out weight connection])
    % connection: 1=AND, 2=OR
    ruleList = [
        1 1 1 1 1;   % IF error=NB AND d_error=NB THEN u=NB
        % ... add all rules
    ];
    fis = addRule(fis, ruleList);

    writefis(fis, ['controllers/' fis.Name '.fis']);
end
```

### PSO Loop Structure
```matlab
function [x_best, f_best, history] = run_pso(cost_fn, p)
% RUN_PSO  Particle Swarm Optimization.
%   cost_fn — function handle @(x) returning scalar cost
%   p.pso.n_particles, p.pso.n_iter, p.pso.w, p.pso.c1, p.pso.c2
%   p.pso.lb, p.pso.ub — lower/upper bounds [1 x n_vars]

    n  = p.pso.n_particles;
    d  = length(p.pso.lb);

    % Initialize
    pos = p.pso.lb + rand(n, d) .* (p.pso.ub - p.pso.lb);
    vel = zeros(n, d);
    pbest     = pos;
    pbest_val = arrayfun(@(i) cost_fn(pos(i,:)), 1:n);
    [f_best, idx] = min(pbest_val);
    x_best = pbest(idx,:);

    history.f_best = zeros(p.pso.n_iter, 1);

    for iter = 1:p.pso.n_iter
        r1 = rand(n, d);  r2 = rand(n, d);
        vel = p.pso.w  * vel ...
            + p.pso.c1 * r1 .* (pbest - pos) ...
            + p.pso.c2 * r2 .* (x_best - pos);

        pos = pos + vel;
        pos = max(min(pos, p.pso.ub), p.pso.lb);  % clamp

        for i = 1:n
            f = cost_fn(pos(i,:));
            if f < pbest_val(i)
                pbest_val(i) = f;
                pbest(i,:)   = pos(i,:);
                if f < f_best
                    f_best = f;
                    x_best = pos(i,:);
                end
            end
        end

        history.f_best(iter) = f_best;
        fprintf('PSO iter %3d/%3d | Best cost: %.6f\n', iter, p.pso.n_iter, f_best);
    end
end
```

### Neural Network (feedforward, Deep Learning Toolbox)
```matlab
% Train a feedforward net
net = feedforwardnet([10 10], 'trainlm');   % 2 hidden layers, 10 neurons each
net.trainParam.epochs = 500;
net.trainParam.goal   = 1e-5;
net.divideParam.trainRatio = 0.7;
net.divideParam.valRatio   = 0.15;
net.divideParam.testRatio  = 0.15;

[net, tr] = train(net, X_train', Y_train');  % inputs: [features x samples]

% Save
save('models/trained_net.mat', 'net', 'tr');

% Load and evaluate
load('models/trained_net.mat', 'net');
Y_pred = net(X_test')';
```

---

## 6. Control Metrics Functions

```matlab
function Tr = compute_rise_time(t, y, low_pct, high_pct)
% Compute 10%-90% rise time (default) for a unit step response.
    if nargin < 3, low_pct = 0.10; end
    if nargin < 4, high_pct = 0.90; end
    ref = y(end);
    t_low  = t(find(y >= low_pct  * ref, 1, 'first'));
    t_high = t(find(y >= high_pct * ref, 1, 'first'));
    Tr = t_high - t_low;
end

function Ts = compute_settling_time(t, y, tol)
% Compute settling time within ±tol of final value (default 2%).
    if nargin < 3, tol = 0.02; end
    ref   = y(end);
    band  = abs(y - ref) > tol * abs(ref);
    last_outside = find(band, 1, 'last');
    if isempty(last_outside), Ts = t(1); else, Ts = t(last_outside); end
end

function OS = compute_overshoot(y)
% Percent overshoot relative to final value.
    OS = (max(y) - y(end)) / y(end) * 100;
end

function J = compute_ITAE(t, e)
% Integral of Time-weighted Absolute Error.
    J = trapz(t, t(:) .* abs(e(:)));
end

function J = compute_ISE(t, e)
% Integral of Squared Error.
    J = trapz(t, e(:).^2);
end
```
