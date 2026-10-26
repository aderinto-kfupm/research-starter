% Entry point: regenerate every figure and result. `make matlab`
run(fullfile(fileparts(mfilename('fullpath')), 'startup.m'));
c = config();
rng(c.seed);
if ~exist(c.figures, 'dir'), mkdir(c.figures); end
if ~exist(c.results, 'dir'), mkdir(c.results); end

% E1 placeholder: step response of a second-order plant. Replace with the real experiment.
[y, t] = step(tf(1, [1 0.8 1]), 0:0.05:20);
save(fullfile(c.results, 'e1_step.mat'), 't', 'y');
fig = figure('Units', 'inches', 'Position', [1 1 3.4 2.4]);  % IEEE single-column width
plot(t, y); grid on; xlabel('Time (s)'); ylabel('Output');
exportgraphics(fig, fullfile(c.figures, 'e1_step.pdf'), 'ContentType', 'vector');
close(fig);
