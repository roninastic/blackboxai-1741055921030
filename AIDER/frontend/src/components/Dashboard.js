import React from 'react';
import { Box, Container, Grid, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { Notifications, Settings, ExitToApp } from '@mui/icons-material';
import DisasterDetection from './features/DisasterDetection';
import EmergencyContacts from './features/EmergencyContacts';
import SafetyGuidance from './features/SafetyGuidance';
import LocationServices from './features/LocationServices';

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DisasterAI - Emergency Detection AI
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit">
            <Settings />
          </IconButton>
          <IconButton color="inherit">
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, Test User!
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <DisasterDetection />
          </Grid>

          <Grid item xs={12} md={4}>
            <EmergencyContacts />
          </Grid>

          <Grid item xs={12} md={4}>
            <SafetyGuidance />
          </Grid>

          <Grid item xs={12} md={4}>
            <LocationServices />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
