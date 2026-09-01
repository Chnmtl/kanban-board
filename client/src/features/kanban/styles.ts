import { styled } from '@mui/material/styles';
import { Box, Paper, Card, CardContent, IconButton, Button } from '@mui/material';
import { boardSurfaces } from '../../theme';

type Surfaces = (typeof boardSurfaces)['dark' | 'light'];

// Visible enough to grab and to hint that there's more to see, quiet enough
// that it reads as part of the board. The transparent border plus
// background-clip keeps the thumb inset so it floats rather than filling the
// gutter edge to edge.
const chalkScrollbar = (s: Surfaces) => ({
    scrollbarWidth: 'thin' as const,
    scrollbarColor: `${s.scrollThumb} transparent`,
    '&::-webkit-scrollbar': { width: 12, height: 12 },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
        background: s.scrollThumb,
        borderRadius: 8,
        border: '3px solid transparent',
        backgroundClip: 'content-box',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: s.scrollThumbHover,
        borderRadius: 8,
        border: '3px solid transparent',
        backgroundClip: 'content-box',
    },
    '&::-webkit-scrollbar-corner': { background: 'transparent' },
});

// Fine-grained noise, used at low opacity as chalk dust over the slate.
const chalkDust =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

// Column-count breakpoints. Under the first the board shows one column, then
// two, and above the second all three sit side by side. The values are the
// viewport widths at which the next column still has roughly 280px to itself
// once the page container, the frame and the gaps are taken out.
const TWO_COLUMNS = 700;
const THREE_COLUMNS = 1050;

// Widest a single column may grow to, so cards don't stretch into unreadable
// bands on a large monitor once the grid tracks are free to expand.
const COLUMN_MAX = 400;

export const BoardFrame = styled(Box)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        padding: theme.spacing(1),
        [theme.breakpoints.up(TWO_COLUMNS)]: { padding: theme.spacing(1.5) },
        borderRadius: 14,
        background: `linear-gradient(160deg, ${s.frame} 0%, ${s.frameEdge} 100%)`,
        boxShadow:
            theme.palette.mode === 'dark'
                ? '0 18px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)'
                : '0 10px 28px rgba(36,48,41,0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
    };
});

export const BoardContainer = styled(Box)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        // A grid rather than a scrolling flex row: the columns reflow onto
        // extra rows as the viewport narrows instead of running off the right
        // edge behind a horizontal scrollbar.
        display: 'grid',
        gridTemplateColumns: `minmax(0, ${COLUMN_MAX}px)`,
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'stretch',
        borderRadius: 8,
        backgroundColor: s.board,
        backgroundImage: `${chalkDust}, radial-gradient(ellipse at 50% 0%, ${s.board} 0%, ${s.boardEdge} 100%)`,
        backgroundBlendMode: theme.palette.mode === 'dark' ? 'overlay' : 'multiply',
        boxShadow: 'inset 0 2px 18px rgba(0,0,0,0.35)',
        ...chalkScrollbar(s),
        [theme.breakpoints.up(TWO_COLUMNS)]: {
            gridTemplateColumns: `repeat(2, minmax(0, ${COLUMN_MAX}px))`,
            gap: theme.spacing(2.5),
            padding: theme.spacing(2.5),
        },
        [theme.breakpoints.up(THREE_COLUMNS)]: {
            gridTemplateColumns: `repeat(3, minmax(0, ${COLUMN_MAX}px))`,
            gap: theme.spacing(3),
            padding: theme.spacing(3),
            // Single row of a fixed height, so each column scrolls its own task
            // list instead of a tall column stretching the row and spilling the
            // cards out past the board frame. minmax(0, …) lets the row honour
            // that cap rather than growing to fit its content.
            minHeight: '78vh',
            height: '78vh',
            gridTemplateRows: 'minmax(0, 1fr)',
        },
    };
});

export const ColumnPaper = styled(Paper)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        // Sized by its grid track, so no min/max of its own; minWidth: 0 stops
        // long card text from forcing the track wider than the board, and
        // minHeight: 0 lets the task list scroll instead of stretching the row.
        width: '100%',
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        borderRadius: 10,
        backgroundColor: s.column,
        backgroundImage: 'none',
        border: `1px solid ${s.columnBorder}`,
        boxShadow: 'none',
        height: '100%',
    };
});

export const ColumnHeader = styled(Box)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        borderBottom: `2px solid ${s.columnBorder}`,
        '& .MuiTypography-root': {
            color: s.chalk,
        },
    };
});

export const TasksBox = styled(Box)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        minHeight: 200,
        // While the columns are stacked the board has no fixed height, so the
        // list is capped here instead — otherwise one full column makes the
        // page scroll on forever.
        maxHeight: '55vh',
        overflowY: 'auto',
        flex: 1,
        paddingRight: 2,
        ...chalkScrollbar(s),
        // In the fixed-height three-column layout the list must be free to
        // shrink below its content so flex + overflow can scroll it.
        [theme.breakpoints.up(THREE_COLUMNS)]: { maxHeight: 'none', minHeight: 0 },
    };
});

export const TaskCard = styled(Card)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        marginBottom: theme.spacing(1.5),
        cursor: 'grab',
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: s.card,
        backgroundImage: 'none',
        color: s.cardText,
        borderRadius: 6,
        border: `1px solid ${s.cardBorder}`,
        // Room on the right for the hover delete button; the top/left/bottom
        // spacing is all handled by TaskCardContent so the card stays even.
        paddingRight: theme.spacing(1),
        boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
        // Only transition box-shadow. @hello-pangea/dnd positions the card with
        // an inline transform every frame during a drag; transitioning transform
        // here makes the card lag the cursor and keep drifting after the drop.
        transition: 'box-shadow 0.18s ease',
        '&:hover': {
            boxShadow: '0 6px 14px rgba(0,0,0,0.32)',
        },
        '&:active': { cursor: 'grabbing' },
        '& .MuiTypography-root': { color: s.cardText },
        '& .MuiTypography-body1': { fontSize: '1.12rem', fontWeight: 700, lineHeight: 1.3 },
        '& .MuiTypography-body2': { color: s.cardMuted, lineHeight: 1.45 },
    };
});

export const TaskCardContent = styled(CardContent)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(1.5),
    // MUI adds extra bottom padding to a last child; keep it even instead.
    '&:last-child': { paddingBottom: theme.spacing(1.5) },
}));

export const DeleteButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'positioned',
})<{ positioned?: boolean }>(({ theme, positioned = false }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        ...(positioned && {
            position: 'absolute',
            top: 6,
            right: 6,
            zIndex: 2,
            opacity: 0,
        }),
        padding: 2,
        width: 26,
        height: 26,
        color: s.cardMuted,
        background: 'transparent',
        borderRadius: '50%',
        transition: 'opacity 0.18s ease, background 0.18s ease, color 0.18s ease',
        '&:hover': {
            background: theme.palette.error.main,
            color: theme.palette.mode === 'dark' ? '#2f3a33' : '#ffffff',
        },
        ...(positioned && {
            '.MuiCard-root:hover &, &:focus-visible': { opacity: 1 },
        }),
    };
});

export const DeleteAllButton = styled(Button)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        marginLeft: theme.spacing(2),
        color: s.chalk,
        background: 'transparent',
        border: `1px solid ${s.columnBorder}`,
        borderRadius: 20,
        boxShadow: 'none',
        fontWeight: 600,
        padding: '5px 18px',
        '&:hover': {
            background: theme.palette.error.main,
            borderColor: theme.palette.error.main,
            color: theme.palette.mode === 'dark' ? '#2f3a33' : '#ffffff',
        },
    };
});

// Tag pills under the card title, one per tag (up to MAX_TAGS). The chalk tag
// palette is all light pastels, so dark text sits on every colour in both the
// slate and whiteboard themes.
export const TagChipRow = styled('div')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(0.75),
    marginBottom: theme.spacing(0.75),
}));

export const TagChip = styled('span', {
    shouldForwardProp: (prop) => prop !== 'bgcolor',
})<{ bgcolor: string }>(({ bgcolor }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.72rem',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: 0.3,
    padding: '4px 9px',
    borderRadius: 999,
    color: '#2f3a33',
    background: bgcolor,
    border: '1px solid rgba(0,0,0,0.18)',
    whiteSpace: 'nowrap',
}));

// Usage tally shown after the tag name in the board summary chips.
export const TagChipCount = styled('span')({
    marginLeft: 6,
    fontWeight: 800,
    fontVariantNumeric: 'tabular-nums',
    opacity: 0.6,
});

export const TagLegendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(0.75),
    alignItems: 'center',
    margin: `${theme.spacing(2)} 0`,
    flexWrap: 'wrap',
}));

export const TagInputContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

export const TagRowContainer = styled(Box)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        border: `1px solid ${s.columnBorder}`,
        borderRadius: 10,
        padding: theme.spacing(2),
        gap: theme.spacing(2),
        background: 'transparent',
    };
});

export const TagFieldsContainer = styled(Box)({
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    gap: 16,
});

export const TagInputWrapper = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: 56,
});

export const ColorPalette = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: 8,
    alignItems: 'center',
    marginRight: 16,
});

export const ColorSwatch = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'bgcolor',
})<{ bgcolor: string; selected: boolean }>(({ bgcolor, selected, theme }) => ({
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: bgcolor,
    border: selected
        ? `2px solid ${boardSurfaces[theme.palette.mode].cardText}`
        : '2px solid transparent',
    boxShadow: selected
        ? `0 0 0 2px ${boardSurfaces[theme.palette.mode].cardText}`
        : 'inset 0 0 0 1px rgba(0,0,0,0.12)',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border 0.2s, box-shadow 0.2s',
}));
