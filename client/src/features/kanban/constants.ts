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

export const DEFAULT_COLUMNS: Column[] = [
    {
        id: 'column-1',
        title: 'To Do',
        tasks: [
            { id: 'task-1', name: 'Fix login bug', description: 'Users cannot log in with Google on mobile devices.', tags: [{ name: 'BUG', color: '#e88b8b' }] },
            { id: 'task-2', name: 'Write docs', description: 'Document the new API endpoints for the frontend team.', tags: [{ name: 'DOC', color: '#93c4e0' }] },
            { id: 'task-3', name: 'Design dashboard', description: 'Create a new dashboard layout for analytics.', tags: [{ name: 'UI', color: '#a8d5a2' }] },
            { id: 'task-4', name: 'Add dark mode', description: 'Implement dark mode toggle in settings.', tags: [{ name: 'UI', color: '#a8d5a2' }] },
        ],
    },
    {
        id: 'column-2',
        title: 'In Progress',
        tasks: [
            { id: 'task-5', name: 'Refactor auth', description: 'Refactor authentication logic for better maintainability.', tags: [{ name: 'CODE', color: '#c3aee0' }] },
            { id: 'task-6', name: 'Write tests', description: 'Add unit tests for the user service.', tags: [{ name: 'CODE', color: '#c3aee0' }] },
        ],
    },
    {
        id: 'column-3',
        title: 'Completed',
        tasks: [
            { id: 'task-7', name: 'Setup CI', description: 'Continuous integration pipeline for PRs.', tags: [{ name: 'OPS', color: '#f2b77c' }] },
            { id: 'task-8', name: 'Initial setup', description: 'Project structure and dependencies.', tags: [{ name: 'INIT', color: '#f0dc82' }] },
        ],
    },
];

export const STORAGE_KEY = 'kanban-columns';

// Colour given to tags recovered from the pre-Tag-object storage format.
export const LEGACY_TAG_COLOR = '#c9c6bc';
