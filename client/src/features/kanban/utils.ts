import { Task } from './types';

// Helper for migration type guard
export function isTaskWithTags(task: unknown): task is Task {
    return typeof task === 'object' && task !== null && 'name' in task && 'description' in task;
}

// Helper for duplicate tag name detection (case-insensitive, ignores empty)
export function hasDuplicateTagNames(tags: { name: string }[]) {
    const seen = new Set<string>();
    for (const t of tags) {
        if (!t.name.trim()) continue;
        const lower = t.name.trim().toLowerCase();
        if (seen.has(lower)) return true;
        seen.add(lower);
    }
    return false;
}

// Returns the reason a tag list can't be saved, or null when it's fine.
export function validateTags(tags: { name: string }[]): string | null {
    if (tags.some(t => !t.name.trim())) return 'Give every tag a name, or remove the empty one.';
    if (hasDuplicateTagNames(tags)) return 'Tag names must be unique.';
    return null;
}

// Task ids double as drag-and-drop keys, so they must never collide.
export function newTaskId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `task-${crypto.randomUUID()}`;
    }
    return `task-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
