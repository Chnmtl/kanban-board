import { Column } from './types';

// Chalk sticks, not Material swatches — muted and dusty so they read as
// pigment on slate rather than UI accents.
export const TAG_COLORS = [
    '#f0dc82', // yellow
    '#93c4e0', // blue
    '#e88b8b', // red
    '#a8d5a2', // green
    '#c3aee0', // purple
    '#f2b77c', // orange
    '#f2a9bc', // pink
    '#8fcfc4', // teal
    '#f2efe4', // white
    '#c9c6bc', // gray
];

// Sample board shown on a first visit (before anything is saved to
// localStorage). Short, familiar cards so the board reads at a glance; a few
// carry two tags to show the multi-tag chips. Tag name -> colour is kept
// consistent across cards so the legend stays tidy.
const TAG = {
    bug: { name: 'Bug', color: '#e88b8b' },
    feature: { name: 'Feature', color: '#a8d5a2' },
    frontend: { name: 'Frontend', color: '#8fcfc4' },
    backend: { name: 'Backend', color: '#93c4e0' },
    docs: { name: 'Docs', color: '#f0dc82' },
    chore: { name: 'Chore', color: '#c9c6bc' },
};

export const DEFAULT_COLUMNS: Column[] = [
    {
        id: 'column-1',
        title: 'To Do',
        tasks: [
            { id: 'task-1', name: 'Fix login redirect loop', description: 'Users bounce between /login and /home.', tags: [TAG.bug] },
            { id: 'task-2', name: 'Dark mode toggle', description: 'Add to settings and remember the choice.', tags: [TAG.feature, TAG.frontend] },
            { id: 'task-3', name: 'Update the README', description: 'Setup steps are out of date.', tags: [TAG.docs] },
        ],
    },
    {
        id: 'column-2',
        title: 'In Progress',
        tasks: [
            { id: 'task-4', name: 'CSV export for reports', description: 'Download the filtered table as CSV.', tags: [TAG.feature, TAG.backend] },
            { id: 'task-5', name: 'Mobile nav menu bug', description: "Menu won't close after tapping a link.", tags: [TAG.bug, TAG.frontend] },
        ],
    },
    {
        id: 'column-3',
        title: 'Completed',
        tasks: [
            { id: 'task-6', name: 'Search the customer list', description: 'Filter by name or email.', tags: [TAG.feature] },
            { id: 'task-7', name: 'Set up CI pipeline', description: 'Lint and build on every pull request.', tags: [TAG.chore] },
            { id: 'task-8', name: 'API docs for /v1', description: 'Document the endpoints with examples.', tags: [TAG.docs, TAG.backend] },
        ],
    },
];

export const STORAGE_KEY = 'kanban-columns';

// Most tags a single task can carry. The card ribbon splits into this many
// segments at most, so more than this would just be invisible clutter.
export const MAX_TAGS = 3;

// Colour given to tags recovered from the pre-Tag-object storage format.
export const LEGACY_TAG_COLOR = '#c9c6bc';
