import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Column, Task, Tag, NewTaskState, EditTaskState, DeleteConfirmState, TagInputState } from './types';
import { DEFAULT_COLUMNS, STORAGE_KEY, LEGACY_TAG_COLOR, MAX_TAGS } from './constants';
import { isTaskWithTags, newTaskId, validateTags } from './utils';
import { TagInput } from './components/TagInput';
import {
    BoardFrame,
    BoardContainer,
    ColumnPaper,
    ColumnHeader,
    TasksBox,
    TaskCard,
    TaskCardContent,
    DeleteButton,
    DeleteAllButton,
    TagChipRow,
    TagChip,
    TagChipCount,
    TagLegendContainer,
} from './styles';

const KanbanBoard = () => {
    // For tag input in add/edit modals
    const [tagInput, setTagInput] = useState<TagInputState[]>([]);
    const [editTagInput, setEditTagInput] = useState<TagInputState[]>([]);

    // Migrate a stored board forward from older shapes. Anything we can't make
    // sense of is dropped rather than turned into a blank task, since a task
    // with an empty id breaks drag-and-drop (ids double as draggable keys).
    const getInitialColumns = (): Column[] => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === null) return DEFAULT_COLUMNS;

        try {
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) return DEFAULT_COLUMNS;

            return parsed
                .filter((col): col is Column => typeof col === 'object' && col !== null && 'id' in col)
                .map((col) => ({
                    ...col,
                    title: col.title ?? '',
                    tasks: (Array.isArray(col.tasks) ? col.tasks : [])
                        .map((task: unknown): Task | null => {
                            if (isTaskWithTags(task)) {
                                const rawTags: Array<string | Tag> = Array.isArray(task.tags) ? task.tags : [];
                                return {
                                    ...task,
                                    id: task.id || newTaskId(),
                                    tags: rawTags.slice(0, MAX_TAGS).map(t =>
                                        typeof t === 'string'
                                            ? { name: t.slice(0, 5), color: LEGACY_TAG_COLOR }
                                            : t
                                    ),
                                };
                            }
                            if (typeof task === 'object' && task !== null && 'id' in task) {
                                // Very old format stored the label as `content`.
                                const t = task as { id: string; content?: string };
                                return { id: t.id || newTaskId(), name: t.content || '', description: '', tags: [] };
                            }
                            return null;
                        })
                        .filter((t): t is Task => t !== null),
                }));
        } catch {
            return DEFAULT_COLUMNS;
        }
    };
    const [columns, setColumns] = useState<Column[]>(getInitialColumns);
    const [newTasks, setNewTasks] = useState<NewTaskState>({});
    const [modalColumnId, setModalColumnId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<EditTaskState | null>(null);
    const [editValues, setEditValues] = useState<{ name: string; description: string }>({ name: '', description: '' });
    const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null);
    const [addError, setAddError] = useState<string | null>(null);
    const [editError, setEditError] = useState<string | null>(null);

    // Save to localStorage on columns change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
    }, [columns]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        setColumns(cols => {
            const moved = cols.find(col => col.id === source.droppableId)?.tasks[source.index];
            if (!moved) return cols;

            return cols.map(col => {
                // Build fresh arrays; splicing the existing ones would mutate state.
                let tasks = col.tasks;
                if (col.id === source.droppableId) {
                    tasks = tasks.filter((_, i) => i !== source.index);
                }
                if (col.id === destination.droppableId) {
                    tasks = [...tasks];
                    tasks.splice(destination.index, 0, moved);
                }
                return tasks === col.tasks ? col : { ...col, tasks };
            });
        });
    };

    // Returns true when the task was actually added, so the caller only closes
    // the dialog on success instead of discarding the user's input.
    const handleAddTask = (columnId: string): boolean => {
        const name = newTasks[columnId]?.name?.trim();
        const description = newTasks[columnId]?.description?.trim();

        if (!name) {
            setAddError('Enter a task name.');
            return false;
        }
        const tagProblem = validateTags(tagInput);
        if (tagProblem) {
            setAddError(tagProblem);
            return false;
        }

        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: [
                            ...col.tasks,
                            { id: newTaskId(), name, description: description || '', tags: tagInput.map(t => ({ name: t.name.trim(), color: t.color })) },
                        ],
                    }
                    : col
            )
        );
        setNewTasks(tasks => ({ ...tasks, [columnId]: { name: '', description: '' } }));
        setTagInput([]);
        setAddError(null);
        return true;
    };

    const closeAddModal = () => {
        if (modalColumnId) {
            setNewTasks(tasks => ({ ...tasks, [modalColumnId]: { name: '', description: '' } }));
        }
        setModalColumnId(null);
        setTagInput([]);
        setAddError(null);
    };

    const closeEditModal = () => {
        setEditingTask(null);
        setEditError(null);
    };

    const handleDeleteTask = (columnId: string, taskId: string) => {
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
                    : col
            )
        );
    };

    // Edit task handler
    const handleEditTask = () => {
        if (!editingTask) return;

        const name = editValues.name.trim();
        if (!name) {
            setEditError('Enter a task name.');
            return;
        }
        const tagProblem = validateTags(editTagInput);
        if (tagProblem) {
            setEditError(tagProblem);
            return;
        }

        setColumns(cols =>
            cols.map(col =>
                col.id === editingTask.columnId
                    ? {
                        ...col,
                        tasks: col.tasks.map(t =>
                            t.id === editingTask.task.id
                                ? { ...t, name, description: editValues.description.trim(), tags: editTagInput.map(tg => ({ name: tg.name.trim(), color: tg.color })) }
                                : t
                        ),
                    }
                    : col
            )
        );
        closeEditModal();
    };

    // When opening edit modal, set editTagInput
    useEffect(() => {
        if (editingTask) {
            setEditTagInput(editingTask.task.tags ? [...editingTask.task.tags] : []);
            setEditError(null);
        }
    }, [editingTask]);

    return (
        <>
            {/* Per-tag usage summary and Delete All button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <TagLegendContainer>
                    {(() => {
                        // Count how many cards carry each tag, keeping first-seen order.
                        const tally = new Map<string, { name: string; color: string; count: number }>();
                        for (const col of columns) {
                            for (const task of col.tasks) {
                                for (const tag of task.tags || []) {
                                    const key = `${tag.name}|${tag.color}`;
                                    const hit = tally.get(key);
                                    if (hit) hit.count += 1;
                                    else tally.set(key, { name: tag.name, color: tag.color, count: 1 });
                                }
                            }
                        }
                        return Array.from(tally.values()).map(({ name, color, count }) => (
                            <TagChip key={`${name}|${color}`} bgcolor={color}>
                                {name}
                                <TagChipCount>{count}</TagChipCount>
                            </TagChip>
                        ));
                    })()}
                </TagLegendContainer>
                <DeleteAllButton
                    variant="contained"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete all tasks?')) {
                            setColumns(cols => cols.map(col => ({ ...col, tasks: [] })));
                        }
                    }}
                >
                    Delete All Tasks
                </DeleteAllButton>
            </Box>
            <DragDropContext onDragEnd={onDragEnd}>
                <BoardFrame>
                <BoardContainer>
                    {columns.map((column) => (
                        <ColumnPaper key={column.id}>
                            <ColumnHeader>
                                <Typography variant="h6">
                                    {column.title}
                                </Typography>
                                <Fab color="primary" size="small"
                                    onClick={() => setModalColumnId(column.id)}
                                    aria-label="add">
                                    <AddIcon />
                                </Fab>
                            </ColumnHeader>
                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <TasksBox ref={provided.innerRef} {...provided.droppableProps}>
                                        {column.tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <TaskCard
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={e => {
                                                            // Prevent edit modal from opening when clicking delete
                                                            if ((e.target as HTMLElement).closest('button')) return;
                                                            setEditingTask({ columnId: column.id, task });
                                                            setEditValues({ name: task.name, description: task.description });
                                                        }}
                                                    >
                                                        <TaskCardContent>
                                                            <Typography fontWeight="bold">{task.name}</Typography>
                                                            {task.tags && task.tags.length > 0 && (
                                                                <TagChipRow>
                                                                    {task.tags.slice(0, MAX_TAGS).map((tag, i) => (
                                                                        <TagChip key={`${tag.name}-${tag.color}-${i}`} bgcolor={tag.color}>{tag.name}</TagChip>
                                                                    ))}
                                                                </TagChipRow>
                                                            )}
                                                            {/* Restrict description to 5 lines in card display (not in modal) */}
                                                            <Typography variant="body2" color="text.secondary" sx={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 5,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>
                                                                {task.description}
                                                            </Typography>
                                                        </TaskCardContent>
                                                        <DeleteButton positioned onClick={e => {
                                                            e.stopPropagation();
                                                            setDeleteConfirm({ columnId: column.id, taskId: task.id });
                                                        }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </DeleteButton>
                                                    </TaskCard>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TasksBox>
                                )}
                            </Droppable>
                        </ColumnPaper>
                    ))}
                </BoardContainer>
                </BoardFrame>
            </DragDropContext>
            {/* Add Task Modal */}
            <Dialog open={!!modalColumnId} onClose={closeAddModal}>
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={modalColumnId ? newTasks[modalColumnId]?.name || '' : ''}
                        onChange={e => {
                            setAddError(null);
                            setNewTasks(tasks => ({ ...tasks, [modalColumnId!]: { ...tasks[modalColumnId!], name: e.target.value } }));
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        minRows={2}
                        value={modalColumnId ? newTasks[modalColumnId]?.description || '' : ''}
                        onChange={e => setNewTasks(tasks => ({ ...tasks, [modalColumnId!]: { ...tasks[modalColumnId!], description: e.target.value } }))}
                        sx={{ mb: 2 }}
                    />
                    <TagInput
                        tags={tagInput}
                        onTagsChange={tags => { setTagInput(tags); setAddError(null); }}
                    />
                    {addError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>{addError}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (modalColumnId && handleAddTask(modalColumnId)) {
                                setModalColumnId(null);
                            }
                        }}
                    >Add</Button>
                </DialogActions>
            </Dialog>
            {/* Edit Task Modal */}
            <Dialog open={!!editingTask} onClose={closeEditModal}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={editValues.name}
                        onChange={e => { setEditError(null); setEditValues(v => ({ ...v, name: e.target.value })); }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        minRows={2}
                        value={editValues.description}
                        onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TagInput
                        tags={editTagInput}
                        onTagsChange={tags => { setEditTagInput(tags); setEditError(null); }}
                    />
                    {editError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>{editError}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeEditModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleEditTask}
                    >Save</Button>
                </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={() => {
                        if (deleteConfirm) handleDeleteTask(deleteConfirm.columnId, deleteConfirm.taskId);
                        setDeleteConfirm(null);
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default KanbanBoard;
