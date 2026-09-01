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

export const BoardFrame = styled(Box)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        padding: theme.spacing(1.5),
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
        display: 'flex',
        gap: theme.spacing(3),
        padding: theme.spacing(3),
        minHeight: '78vh',
        height: '78vh',
        // "safe center" centres while there is room but falls back to
        // flex-start once the columns overflow, so the first column can't be
        // pushed off the unreachable left edge.
        justifyContent: 'safe center',
        alignItems: 'stretch',
        borderRadius: 8,
        backgroundColor: s.board,
        backgroundImage: `${chalkDust}, radial-gradient(ellipse at 50% 0%, ${s.board} 0%, ${s.boardEdge} 100%)`,
        backgroundBlendMode: theme.palette.mode === 'dark' ? 'overlay' : 'multiply',
        boxShadow: 'inset 0 2px 18px rgba(0,0,0,0.35)',
        overflowX: 'auto',
        ...chalkScrollbar(s),
    };
});

export const ColumnPaper = styled(Paper)(({ theme }) => {
    const s = boardSurfaces[theme.palette.mode];
    return {
        flex: 1,
        minWidth: 300,
        maxWidth: 380,
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
        overflowY: 'auto',
        flex: 1,
        paddingRight: 2,
        ...chalkScrollbar(s),
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
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
        '&:hover': {
            boxShadow: '0 6px 14px rgba(0,0,0,0.32)',
        },
        '&:active': { cursor: 'grabbing' },
        '& .MuiTypography-root': { color: s.cardText },
        '& .MuiTypography-body1': { fontSize: '1.12rem', fontWeight: 700, lineHeight: 1.3 },
        '& .MuiTypography-body2': { color: s.cardMuted, lineHeight: 1.45 },
    };
});

export const TaskCardContent = styled(CardContent)({
    flexGrow: 1,
    paddingBottom: 8,
});

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

export const TagRibbon = styled('div', {
    shouldForwardProp: (prop) => prop !== 'bgcolor',
})<{ bgcolor: string }>(({ bgcolor }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: 5,
    height: '100%',
    background: bgcolor,
    zIndex: 1,
    pointerEvents: 'none',
}));

export const TagLegendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
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

export const TagSwatch = styled('span', {
    shouldForwardProp: (prop) => prop !== 'bgcolor',
})<{ bgcolor: string }>(({ bgcolor, theme }) => ({
    display: 'inline-block',
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: bgcolor,
    marginRight: theme.spacing(1),
    verticalAlign: 'middle',
}));
