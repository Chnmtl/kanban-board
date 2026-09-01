import { Box, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../useColorMode';

function NavTabs({ leftContent }: { leftContent?: React.ReactNode }) {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 3, py: 1.5 }}>
      {leftContent && (
        <Box sx={{
          fontFamily: "'Caveat', 'Segoe Script', cursive",
          fontWeight: 700,
          fontSize: 34,
          lineHeight: 1,
          letterSpacing: 0.5,
        }}>
          {leftContent}
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <IconButton onClick={toggleColorMode} color="inherit" aria-label="Toggle light and dark mode">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
}

export default NavTabs;
