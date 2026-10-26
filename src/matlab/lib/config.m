function c = config()
%CONFIG Single place for paths, seed, and parameters (keep in sync with docs/methodology.md).
here = fileparts(mfilename('fullpath'));
c.root    = fullfile(here, '..', '..', '..');
c.figures = fullfile(c.root, 'figures');
c.results = fullfile(c.root, 'results');
c.seed    = 0;
end
