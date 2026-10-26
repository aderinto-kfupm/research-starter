function tests = smoke_test
% Run with: make matlab-test
tests = functiontests(localfunctions);
end

function testRunAllProducesOutputs(testCase)
root = fullfile(fileparts(mfilename('fullpath')), '..', '..');
run(fullfile(root, 'src', 'matlab', 'run_all.m'));
verifyTrue(testCase, isfile(fullfile(root, 'figures', 'e1_step.pdf')));
verifyTrue(testCase, isfile(fullfile(root, 'results', 'e1_step.mat')));
end
