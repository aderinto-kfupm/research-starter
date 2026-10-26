% Adds project code to the path. Run from anywhere: run('src/matlab/startup.m')
here = fileparts(mfilename('fullpath'));
addpath(fullfile(here, 'lib'), fullfile(here, 'models'));
