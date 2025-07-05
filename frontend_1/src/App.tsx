// src/App.tsx
import { Box, Container, Typography } from '@mui/material';
import Header from './components/Header';
import PostGenerator from './components/PostGenerator';
import ImageGenerator from './components/ImageGenerator';
import LinkedInActions from './components/LinkedInActions';
import './App.css'; // You can keep this or leave it minimal

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.light', mb: 4, textAlign: 'center' }}>
          Welcome to Your LinkedIn Automation Dashboard
        </Typography>

        <PostGenerator />
        <ImageGenerator />
        <LinkedInActions />

        {/* You can add a footer here if needed */}
        <Box sx={{ mt: 5, py: 3, textAlign: 'center', color: 'text.secondary', borderTop: '1px solid #333' }}>
          <Typography variant="body2">&copy; {new Date().getFullYear()} LinkedIn Automation. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;