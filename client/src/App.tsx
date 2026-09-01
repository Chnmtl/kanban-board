import './App.css';
import KanbanBoard from './features/kanban/KanbanBoard';
import NavTabs from './components/NavTabs';
import { Box, Container } from '@mui/material';

function Header() {
  return (
    <NavTabs leftContent={<span>Kanban Board</span>} />
  );
}

function Footer() {
  return (
    <Box component="footer" sx={{
      width: '100%',
      color: 'text.secondary',
      textAlign: 'center',
      py: 2,
      mt: 3,
      fontSize: 14,
    }}>
      © {new Date().getFullYear()} Kanban Board
    </Box>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="xl" sx={{ minHeight: '70vh', py: 3 }}>
      {children}
    </Container>
  );
}

function App() {
  return (
    <>
      <Header />
      <MainContent>
        <KanbanBoard />
      </MainContent>
      <Footer />
    </>
  );
}

export default App;
