import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Box } from '@mui/material';
import { Warning, CheckCircle, Info } from '@mui/icons-material';

const SafetyGuidance = () => {
  const [currentDisaster, setCurrentDisaster] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Simulated AI recommendations based on disaster type
  const getAIRecommendations = (disasterType) => {
    const recommendationsByType = {
      'Collapsed Building': [
        { severity: 'high', text: 'Evacuate immediately if inside', icon: <Warning color="error" /> },
        { severity: 'high', text: 'Stay away from unstable structures', icon: <Warning color="error" /> },
        { severity: 'medium', text: 'Call emergency services', icon: <Info color="warning" /> },
        { severity: 'medium', text: 'Help others if safe to do so', icon: <Info color="warning" /> },
      ],
      'Fire': [
        { severity: 'high', text: 'Evacuate immediately', icon: <Warning color="error" /> },
        { severity: 'high', text: 'Stay low to avoid smoke', icon: <Warning color="error" /> },
        { severity: 'medium', text: 'Call fire department', icon: <Info color="warning" /> },
        { severity: 'low', text: 'Close doors behind you', icon: <CheckCircle color="success" /> },
      ],
      'Flooded Areas': [
        { severity: 'high', text: 'Move to higher ground', icon: <Warning color="error" /> },
        { severity: 'high', text: 'Avoid walking in water', icon: <Warning color="error" /> },
        { severity: 'medium', text: 'Prepare emergency kit', icon: <Info color="warning" /> },
        { severity: 'low', text: 'Monitor local news', icon: <CheckCircle color="success" /> },
      ],
      'Traffic Incident': [
        { severity: 'high', text: 'Stay in your vehicle if safe', icon: <Warning color="error" /> },
        { severity: 'medium', text: 'Call emergency services', icon: <Info color="warning" /> },
        { severity: 'medium', text: 'Turn on hazard lights', icon: <Info color="warning" /> },
        { severity: 'low', text: 'Document the incident', icon: <CheckCircle color="success" /> },
      ],
    };

    return recommendationsByType[disasterType] || [];
  };

  // Simulated real-time monitoring
  useEffect(() => {
    // In a real application, this would be connected to the AI detection system
    const checkForDisasters = () => {
      // Simulated disaster detection
      const disasters = ['Collapsed Building', 'Fire', 'Flooded Areas', 'Traffic Incident'];
      const randomDisaster = disasters[Math.floor(Math.random() * disasters.length)];
      setCurrentDisaster(randomDisaster);
      setRecommendations(getAIRecommendations(randomDisaster));
    };

    // Initial check
    checkForDisasters();

    // Update every 30 seconds
    const interval = setInterval(checkForDisasters, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Safety Guidance
        </Typography>
        <Typography color="textSecondary" paragraph>
          AI-powered safety recommendations
        </Typography>

        {currentDisaster && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Current Threat: ${currentDisaster}`}
              color="error"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <List>
              {recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {rec.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={rec.text}
                    secondary={
                      <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                        <Chip
                          label={rec.severity.toUpperCase()}
                          size="small"
                          color={getSeverityColor(rec.severity)}
                        />
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {!currentDisaster && (
          <Typography variant="body1" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ mr: 1 }} />
            No immediate threats detected
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SafetyGuidance;
