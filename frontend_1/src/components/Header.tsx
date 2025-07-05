// src/components/Header.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#212121' }}> {/* Slightly darker for AppBar */}
      <Toolbar>
        <LinkedInIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LinkedIn Automation Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;