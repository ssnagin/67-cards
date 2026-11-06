# AGENTS.md | Requirements for AI Agents

If you would ever use AI agents in this project, these agents must obey rules that are written in this document.

## Termins

- Owner - 

- AI bot - 

## General Information

Before working with the any part of the project, etirely read the docs/ folder. This folder contains valuable information. AI bot must follow the project rules. If everything is clear and understandable, supplement the documentation in the doc folder at the end of each work session (update existing documentation, create new documentation). If you see any inconsistencies, report them and suggest corrections and improvements.

## Workflow

### General information

AI Bot should not start, restart, or stop the dev server without a direct user request. For frontend testing, use an existing server on 8080. If it doesn't respond within 5 seconds, report it and continue without attempting to start. Avoid running long-running commands like manage.py runserver in the foreground.

Use browser-use / Playwright / in-app browser only upon explicit user request: "open in browser," "check visually," "take a screenshot," "test frontend." For common, minor HTML/CSS/JS edits, do not automatically launch browser-use/Playwright; limit yourself to code checking and report that visual checking was not performed.

### Backend

Backend server is running at the port 16768

### Frontend

Frontend server is running at the port 3000

### Designing

These rules apply whenever an AI agent designs, reviews, describes, or implements a user interface.

#### Source of Truth

Before starting design work, the AI agent must:

- Read the relevant product documentation and requirements in docs/ folder
- Inspect existing designs, UI components, styles, tokens, and frontend implementation, especially in docs/design folder.
- Identify the affected entities, user roles, permissions, and business rules.
- Reuse existing design patterns and components whenever they are suitable.
- Report contradictions between documentation, design, and implementation before treating one version as correct.
- Work with designs only in docs/design folder, all data about this should be stored here unless a warden (human) won't tell otherwhise.

The priority of sources is:

- explicitly stated user requirements;
- approved project documentation;
- approved FigCraft (Figma) designs and design-system components;
- current implementation;
- reasonable assumptions made by the AI agent;

AI agents must follow this order. Assumptions must be clearly marked and must not silently become product requirements.

#### Design task definition

Before producing a design, the AI agent must determine:
- the goal of the screen or flow;
- the primary user role;
- the user’s main action;
- the device and viewport;
- the entry and exit points of the flow;
- the data displayed on the screen;
- applicable permissions and business rules;
- expected loading, empty, error, offline, and success states;
- whether the result is exploratory or ready for implementation.

If any missing decision materially affects the architecture of the interface, the AI agent must report it as an open question.

#### User roles and contexts

The AI agent must not design a single universal interface when different roles have different responsibilities.

#### Required screen states

For every important screen or component, consider all applicable states:

- default;
- hover;
- focus-visible;
- active or pressed;
- disabled;
- loading;
- skeleton;
- empty;
- partially completed;
- success;
- validation error;
- server error;
- no access;
- read-only;
- offline;
- reconnecting;
- stale data;
- action pending server confirmation;
- action accepted and locked;
- action rejected;
- destructive action confirmation;
- long content and overflow;
- maximum realistic amount of data.

The AI agent must not present only the ideal happy-path state.

#### Responsive design

Player interfaces must be designed mobile-first: 320×568, 360×800, 390×844.

Host and authoring interfaces must be designed for desktop and tablet: 1024×768, 1280×800, 1440×900.

Shared game displays must be checked at 1920×1080.

#### Accessibility

The AI agent must ensure that:

- text and controls have contrast, are normally visible;
- status is not communicated by color alone;
- correct and incorrect states include icons;
- keyboard focus is visible;
- interactive targets are at least 44×44 px, where practical;
- drag-and-drop actions have an accessible alternative;
- forms have labels and actionable error messages;
- animation has a reduced-motion alternative;
- text remains usable when enlarged;
- shared-screen content is readable from a distance.

#### Content requirements

Use realistic Russian-language content instead of placeholder text whenever possible.

Do not use meaningless Lorem Ipsum in implementation-ready designs.

Fit the design requirements with:

- long names and titles;
- long questions and answers;
- missing images;
- large numbers and balances;
- zero and negative values;
- duplicate player names;
- up to 30 players;
- long validation messages;
- plural forms and changing counters.

#### Visual consistency

Before creating a new style or component, check whether a suitable one already exists.

Use shared:

- color variables;
- typography styles;
- spacing tokens;
- grids;
- radii;
- shadows;
- icons;
- components;
- interaction patterns.

New components must be justified by a distinct interaction or semantic need.

#### Component requirements

Reusable components must include all relevant variants and states.

Component names should describe purpose rather than appearance. Avoid names such as `Purple button or Large card 2`.

#### Animation and motion

Animations must communicate state changes, not merely decorate the interface.

For every significant animation, specify:

- trigger;
- duration;
- easing;
- interruption behavior;
- final state;
- reduced-motion alternative.

Random game animations must display a result already determined by the server. The animation must not imply that the client chooses the result.

#### Destructive and high-risk actions

Deleting content, ending a session, removing access, changing balances, and similar actions must:

- be visually distinct from routine actions;
- state what will be affected;
- request confirmation where accidental activation is plausible;
- explain whether the action can be undone;
- provide visible success or failure feedback.

`End round` and `End session` must never appear as visually interchangeable actions.

#### Project organization

separate foundations, product screens, live-session screens, and archive materials;
keep explorations separate from approved frames;
name frames using Area / Flow / Screen / State / Device;
use components instead of manually duplicated elements;
use Variables and Styles instead of unexplained local values;
connect primary flows into clickable prototypes;
mark implementation-ready frames explicitly;

#### Visual verification

The AI agent must not claim that a design or frontend implementation was visually verified unless it was actually rendered and inspected by a human.

Any visual defects found during verification must be reported.

#### Design review response format

When reviewing a design, group findings by priority:

Critical — blocks the user flow, exposes protected information, or can cause an irreversible mistake;
High — creates serious confusion, accessibility failure, or incorrect business behavior;
Medium — harms usability, consistency, or responsive behavior;
Low — visual polish or minor clarity improvement.

Each finding should include:

affected screen or component;
observed problem;
user impact;
recommended correction;
requirement or design principle involved.

Do not limit a design review to personal visual preference.

#### Task to human making

While collaborating with a human, try to clarify their criterias if these are not specified by following these questions:

Goal

What user or business problem must the design solve?

User role

Who uses the interface, and what permissions do they have?

Scenario

Where does the user enter the flow, what do they do, and what is the expected result?

Platform and viewport

Specify mobile, tablet, desktop, shared display, and the target dimensions.

Entities and data

List the entities, fields, limits, and realistic example data displayed on the screen.

Business rules

Describe validation, permissions, ordering rules, server-confirmed actions, and forbidden operations.

Required screens

List the screens, dialogs, drawers, and overlays that must be designed.

Required states

List loading, empty, error, offline, read-only, disabled, success, locked, and maximum-data states.

Existing references

Point to relevant requirements, Figma frames, frontend components, and design-system elements.

Visual direction

Describe the intended tone and brand qualities. Separate mandatory constraints from preferences.

Deliverables

Specify whether the result should contain wireframes, polished frames, components, responsive variants, prototypes, annotations, or a design review.

Acceptance criteria

Define what must be true for the task to be considered complete.

Open decisions

List questions the designer may explore and decisions that require owner approval.

### Reading

When reading files with Russian text in PowerShell, always use Get-Content -Encoding UTF8; if you see Ð.../unreadable letters, first double-check with -Encoding UTF8 or rg; do not consider the file corrupted based on the output of Get-Content without explicit encoding.

### Editing

Use a DRY approach when developing. Before developing a new feature or inventing a new style, always make sure nothing similar already exists in the project. Do your very best to make code DRY.

When designing new models, normalize them as much as possible. Avoid storing parameters for dozens of different entities in a single class. Make classes as specific as possible. This is necessary to prevent classes from growing in parameters as the project grows and to evenly distribute the database load when there are a large number of active users.

#### Comments

Add comments to your code to help human developers navigate your codebase more quickly.

### Suggesting

### Testing

Don't use the term "MVP" when working on new parts and features of the project. We don't aim to test hypotheses or create minimum viable versions—we work from the start with the paradigm of "doing it right, making it last, and ensuring architectural stability." Our components are scalable, addressing security concerns and reusability in other areas of the system. During design, we try not to cut functionality, but rather think several steps ahead. If necessary, I will personally define the boundaries of the next feasible version.

### Project scaling

When making product decisions regarding code, architecture, and other matters, keep in mind that we're aiming for 5000 paid users in production. At any given time, 100 people will be using the server. We currently have Rasberry PI 5 with four cores and 6 GB of RAM — let us know if this capacity isn't sufficient for our next innovation.

### Deployment

Before doing anything on any of the production servers, please ask me for confirmation.