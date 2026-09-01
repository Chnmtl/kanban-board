import { createTheme } from '@mui/material/styles';

// Caveat carries the big chalk-scrawl headings; Kalam is the same hand but
// stays legible down at card-text sizes (and ships a real 700 weight).
const handwriting = "'Caveat', 'Segoe Script', 'Bradley Hand', cursive";
const body = "'Kalam', 'Segoe Print', 'Comic Sans MS', cursive";

// Surfaces that aren't expressible as MUI palette slots: the board itself, its
// frame, and the paper cards that sit on top of it.
export const boardSurfaces = {
    dark: {
        board: '#22382c',
        boardEdge: '#1a2b22',
        frame: '#6b4b30',
        frameEdge: '#4a3320',
        column: 'rgba(255, 255, 255, 0.04)',
        columnBorder: 'rgba(242, 239, 228, 0.18)',
        card: '#f7f3e6',
        cardBorder: 'transparent',
        cardText: '#2f3a33',
        cardMuted: '#6b7169',
        chalk: '#f2efe4',
        scrollThumb: 'rgba(242, 239, 228, 0.24)',
        scrollThumbHover: 'rgba(242, 239, 228, 0.44)',
    },
    light: {
        board: '#fdfdfb',
        boardEdge: '#f0efe8',
        frame: '#bcc1bd',
        frameEdge: '#989e99',
        column: 'rgba(34, 56, 44, 0.03)',
        columnBorder: 'rgba(34, 56, 44, 0.16)',
        card: '#ffffff',
        cardBorder: 'rgba(36, 48, 41, 0.12)',
        cardText: '#243029',
        cardMuted: '#6a726c',
        chalk: '#243029',
        scrollThumb: 'rgba(36, 48, 41, 0.22)',
        scrollThumbHover: 'rgba(36, 48, 41, 0.4)',
    },
} as const;

const shared = {
    shape: { borderRadius: 10 },
    typography: {
        fontFamily: body,
        // Handwriting reads smaller than a sans at the same px, so everything
        // is nudged up a step and given extra leading.
        h4: { fontFamily: handwriting, fontWeight: 700, letterSpacing: '0.02em' },
        h5: { fontFamily: handwriting, fontWeight: 700, letterSpacing: '0.02em' },
        h6: { fontFamily: handwriting, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '0.02em' },
        body1: { fontFamily: body, fontSize: '1.02rem', lineHeight: 1.5 },
        body2: { fontFamily: body, fontSize: '0.95rem', lineHeight: 1.5 },
        subtitle2: { fontFamily: body, fontSize: '1rem', fontWeight: 700 },
        button: { fontFamily: body, fontWeight: 700, textTransform: 'none' as const },
    },
};

export const darkTheme = createTheme({
    ...shared,
    palette: {
        mode: 'dark',
        primary: { main: '#f0dc82', contrastText: '#2b3a2f' },
        secondary: { main: '#93c4e0', contrastText: '#2b3a2f' },
        background: { default: '#1b2c23', paper: '#243a2e' },
        text: { primary: '#f2efe4', secondary: '#b9c9bd' },
        error: { main: '#e88b8b' },
        success: { main: '#a8d5a2' },
        divider: 'rgba(242, 239, 228, 0.16)',
    },
    components: {
        ...componentOverrides('dark'),
    },
});

export const lightTheme = createTheme({
    ...shared,
    palette: {
        mode: 'light',
        primary: { main: '#2f7d5d', contrastText: '#ffffff' },
        secondary: { main: '#2d6b8f', contrastText: '#ffffff' },
        background: { default: '#dcdad1', paper: '#ffffff' },
        text: { primary: '#243029', secondary: '#5f6862' },
        error: { main: '#c1543f' },
        success: { main: '#2f7d5d' },
        divider: 'rgba(36, 48, 41, 0.14)',
    },
    components: {
        ...componentOverrides('light'),
    },
});

function componentOverrides(mode: 'dark' | 'light') {
    const s = boardSurfaces[mode];
    return {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    '--app-bg': mode === 'dark' ? '#1b2c23' : '#dcdad1',
                    '--app-text': s.chalk,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: s.card,
                    color: s.cardText,
                    borderRadius: 14,
                    // The dialog is paper sitting on the board, so its contents
                    // need card colours rather than the chalk palette.
                    '& .MuiTypography-root': { color: s.cardText },
                    '& .MuiInputBase-input': { color: s.cardText },
                    '& .MuiInputLabel-root': { color: s.cardMuted },
                    '& .MuiInputLabel-root.Mui-focused': { color: s.cardText },
                    '& .MuiFormHelperText-root': { color: s.cardMuted },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(47, 58, 51, 0.28)',
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(47, 58, 51, 0.5)',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: s.cardText,
                    },
                    '& .MuiButton-text': { color: s.cardText },
                    '& .MuiButton-outlined': {
                        color: s.cardText,
                        borderColor: 'rgba(47, 58, 51, 0.35)',
                    },
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontFamily: handwriting,
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: s.cardText,
                    paddingBottom: 4,
                },
            },
        },
    };
}
