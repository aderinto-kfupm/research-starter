# Simulink Programmatic API Reference

## Table of Contents
1. [Core Functions](#1-core-functions)
2. [Block Library Paths](#2-block-library-paths)
3. [set_param by Block Type](#3-set_param-by-block-type)
4. [Soft Computing Blocks](#4-soft-computing-blocks)
5. [Subsystem Patterns](#5-subsystem-patterns)
6. [Signal Naming and Buses](#6-signal-naming-and-buses)
7. [Simulation & Results Extraction](#7-simulation--results-extraction)

---

## 1. Core Functions

```matlab
% Create / manage model
new_system('ModelName')               % Create new blank model
open_system('ModelName')              % Open (or bring to front)
close_system('ModelName', 0)          % Close without saving
save_system('ModelName', 'path.slx')  % Save to file
bdIsLoaded('ModelName')               % Check if model is open (returns logical)

% Add blocks
add_block('lib/BlockType', 'ModelName/BlockLabel', ...
    'Position', [left top right bottom], ...   % pixels
    'PropertyName', 'value', ...)

% Add connections
add_line('ModelName', 'BlockA/outport', 'BlockB/inport', 'autorouting', 'on')
% Port numbers are 1-indexed integers

% Delete
delete_block('ModelName/BlockLabel')
delete_line('ModelName', 'BlockA/1', 'BlockB/1')

% Parameters
set_param('ModelName/Block', 'Property', 'Value')
get_param('ModelName/Block', 'Property')

% Model-level simulation settings
set_param('ModelName', ...
    'StopTime',       '10',      ...  % string
    'StartTime',      '0',       ...
    'FixedStep',      '0.01',    ...  % for fixed-step solvers
    'Solver',         'ode45',   ...  % variable-step
    'SolverType',     'Fixed-step', ...
    'MaxStep',        '0.001')

% Run simulation
simOut = sim('ModelName');
simOut = sim('ModelName', 'StopTime', '10');
```

---

## 2. Block Library Paths

### Sources
```
simulink/Sources/Step
simulink/Sources/Ramp
simulink/Sources/Sine Wave
simulink/Sources/Constant
simulink/Sources/Signal Generator
simulink/Sources/From Workspace         % loads from base workspace variable
simulink/Sources/Chirp Signal
```

### Sinks
```
simulink/Sinks/Scope
simulink/Sinks/To Workspace             % saves to base workspace
simulink/Sinks/To File                  % saves to .mat file
simulink/Sinks/Display
simulink/Sinks/XY Graph
```

### Math Operations
```
simulink/Math Operations/Sum            % Inputs property: '++', '+-', '-+'
simulink/Math Operations/Product
simulink/Math Operations/Gain
simulink/Math Operations/Math Function  % sqrt, exp, log, abs, etc.
simulink/Math Operations/Abs
simulink/Math Operations/Trigonometric Function
simulink/Math Operations/Dot Product
simulink/Math Operations/Matrix Multiply
```

### Continuous
```
simulink/Continuous/Integrator
simulink/Continuous/Derivative
simulink/Continuous/Transfer Fcn        % Numerator, Denominator as '[a b c]'
simulink/Continuous/State-Space         % A, B, C, D matrices
simulink/Continuous/PID Controller      % P, I, D, N (filter coeff)
simulink/Continuous/Zero-Pole
simulink/Continuous/Transport Delay
```

### Discrete
```
simulink/Discrete/Discrete-Time Integrator
simulink/Discrete/Discrete Transfer Fcn
simulink/Discrete/Unit Delay
simulink/Discrete/Zero-Order Hold
simulink/Discrete/Discrete PID Controller
simulink/Discrete/Discrete State-Space
```

### Signal Routing
```
simulink/Signal Routing/Mux             % Multiplexer (n signals → vector)
simulink/Signal Routing/Demux           % Vector → n signals
simulink/Signal Routing/Bus Creator
simulink/Signal Routing/Bus Selector
simulink/Signal Routing/Switch
simulink/Signal Routing/Multiport Switch
simulink/Signal Routing/Selector
```

### Lookup Tables
```
simulink/Lookup Tables/1-D Lookup Table
simulink/Lookup Tables/2-D Lookup Table
simulink/Lookup Tables/n-D Lookup Table
```

### Discontinuities (useful for saturation, deadzone)
```
simulink/Discontinuities/Saturation     % UpperLimit, LowerLimit
simulink/Discontinuities/Dead Zone
simulink/Discontinuities/Rate Limiter
simulink/Discontinuities/Relay
```

### Ports & Subsystems
```
simulink/Ports & Subsystems/Subsystem
simulink/Ports & Subsystems/In1          % Input port inside subsystem
simulink/Ports & Subsystems/Out1         % Output port inside subsystem
simulink/Ports & Subsystems/Enabled Subsystem
simulink/Ports & Subsystems/Triggered Subsystem
```

---

## 3. set_param by Block Type

### Step source
```matlab
set_param([m '/Step'], ...
    'Time',         '1',     ...   % step time [s]
    'Before',       '0',     ...   % initial value
    'After',        '1',     ...   % final value
    'SampleTime',   '0')           % 0 = continuous
```

### Gain
```matlab
set_param([m '/Gain'], 'Gain', num2str(p.K))
```

### Transfer Function
```matlab
set_param([m '/Plant'], ...
    'Numerator',    '[1]',         ...
    'Denominator',  '[1 2 1]')     % coefficients high→low power
```

### State-Space
```matlab
set_param([m '/SS'], ...
    'A', mat2str(p.A), ...
    'B', mat2str(p.B), ...
    'C', mat2str(p.C), ...
    'D', mat2str(p.D))
```

### PID Controller
```matlab
set_param([m '/PID'], ...
    'P',             num2str(p.Kp), ...
    'I',             num2str(p.Ki), ...
    'D',             num2str(p.Kd), ...
    'N',             '100',         ...  % derivative filter coefficient
    'InitialConditionSource', 'internal', ...
    'InitialCondition',       '0')
```

### Integrator
```matlab
set_param([m '/Int'], ...
    'InitialCondition', '0', ...
    'UpperSaturationLimit',  'inf', ...
    'LowerSaturationLimit', '-inf')
```

### Saturation
```matlab
set_param([m '/Sat'], ...
    'UpperLimit', num2str(p.u_max), ...
    'LowerLimit', num2str(p.u_min))
```

### To Workspace
```matlab
set_param([m '/ToWS'], ...
    'VariableName', 'y_out',       ...
    'Buffer',       'inf',         ...
    'SaveFormat',   'Array')        % or 'Structure With Time'
```

### Scope
```matlab
set_param([m '/Scope'], 'SaveToWorkspace', 'on', 'SaveName', 'scope_data')
```

---

## 4. Soft Computing Blocks

### Fuzzy Logic Toolbox
```matlab
% Block path
'fuzzy/Fuzzy Logic Controller'          % requires Fuzzy Logic Toolbox

% Set the FIS — load from file or build programmatically
fis = readfis('my_controller.fis');     % load from .fis file
% OR build inline:
fis = mamfis('Name', 'SpeedController');
fis = addInput(fis,  [0 10], 'Name', 'error');
fis = addOutput(fis, [-1  1], 'Name', 'u');
% ... add MFs, rules ...

set_param([m '/FuzzyBlock'], 'FISFile', 'my_controller.fis')
% OR pass struct name as string if stored in workspace:
%   evalin('base', 'assignin(''base'', ''fis'', fis)')
%   set_param([m '/FuzzyBlock'], 'FISFile', 'fis')

% Standalone fuzzy evaluation (no Simulink)
u = evalfis(fis, [error, d_error]);
```

### Neural Network Control Blocks (Deep Learning Toolbox)
```matlab
'nnet/Neural Network'
% Typically easier to implement NN controllers as MATLAB Function blocks:
add_block('simulink/User-Defined Functions/MATLAB Function', [m '/NNController'], ...)
% Then edit the function body to call net(u) on a trained network object
```

### PSO / ACO (no toolbox block — use MATLAB Function block)
```matlab
add_block('simulink/User-Defined Functions/MATLAB Function', [m '/Optimizer'], ...)
% Implement the optimization loop inside; use persistent variables for state
```

---

## 5. Subsystem Patterns

### Creating a subsystem programmatically
```matlab
% Method: add a Subsystem block, then add internal blocks inside it
add_block('simulink/Ports & Subsystems/Subsystem', [m '/ControlSubsystem'], ...
    'Position', [200 80 340 160]);

% Clear default contents
Simulink.SubSystem.deleteContents([m '/ControlSubsystem']);

% Add internal blocks (use full path including subsystem name)
add_block('simulink/Continuous/PID Controller', [m '/ControlSubsystem/PID'], ...
    'Position', [100 80 200 130]);
add_block('simulink/Ports & Subsystems/In1',  [m '/ControlSubsystem/In1'], ...
    'Position', [20 100 50 130]);
add_block('simulink/Ports & Subsystems/Out1', [m '/ControlSubsystem/Out1'], ...
    'Position', [280 100 310 130]);

% Connect internal blocks
add_line([m '/ControlSubsystem'], 'In1/1', 'PID/1',  'autorouting','on');
add_line([m '/ControlSubsystem'], 'PID/1', 'Out1/1', 'autorouting','on');
```

### Block positioning guide
Lay out blocks left-to-right matching the block diagram image.
Standard block size: `[left top left+70 top+40]` for normal blocks.
Standard port size:  `[left top left+30 top+20]` for In/Out ports.
Leave ~80px horizontal gap between blocks for clean autorouting.

```
% Example layout (signal flows left to right):
% [50 100 120 140] → [200 100 270 140] → [420 100 490 140] → [640 100 710 140]
%   Reference           Controller           Plant               Scope
```

---

## 6. Signal Naming and Buses

```matlab
% Name a line (signal label in diagram)
ph = get_param([m '/BlockName/1'], 'PortHandles');
% Use Simulink.Signal or just set line names via line handles:
lh = add_line(m, 'Plant/1', 'Scope/1', 'autorouting', 'on');
set(lh, 'Name', 'y_output');

% Log a signal to the workspace
set_param([m '/To Workspace'], 'VariableName', 'y_log', 'SaveFormat', 'Array')
```

---

## 7. Simulation & Results Extraction

```matlab
% Run and capture all logged signals
simOut = sim(model_name, ...
    'StopTime',  num2str(p.t_end_s), ...
    'SaveState', 'on', ...
    'StateSaveName', 'xout', ...
    'SaveOutput', 'on', ...
    'OutputSaveName', 'yout');

% Access time and outputs
t = simOut.tout;
y = simOut.yout;             % if logged as array

% If using To Workspace blocks with 'Structure With Time':
sig = simOut.get('signal_name');
t   = sig.time;
val = sig.signals.values;

% If using logsout (Simulink Data Inspector logging):
logs = simOut.logsout;
y_sig = logs.getElement('y_output');
t   = y_sig.Values.Time;
val = y_sig.Values.Data;
```
