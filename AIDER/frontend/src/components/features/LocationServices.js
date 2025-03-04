import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Button, Box, LinearProgress, Alert, Chip } from '@mui/material';
import { LocationOn, MyLocation, Warning } from '@mui/icons-material';

const LocationServices = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [areaRisk, setAreaRisk] = useState(null);
  const [nearbyThreats, setNearbyThreats] = useState([]);

  // Simulated AI risk assessment based on location
  const assessAreaRisk = useCallback((latitude, longitude) => {
    // In a real application, this would call an AI service to analyze:
    // - Historical disaster data
    // - Current weather conditions
    // - Geographic features
    // - Infrastructure status
    // - Population density
    // For demo, we'll generate random risk levels
    const riskLevel = Math.random();
    const risk = {
      level: riskLevel < 0.3 ? 'low' : riskLevel < 0.7 ? 'medium' : 'high',
      score: Math.round(riskLevel * 100),
      threats: []
    };

    // Simulate nearby threats based on risk level
    if (risk.level === 'high') {
      risk.threats = [
        { type: 'Flood Risk', distance: '2.5km', severity: 'high' },
        { type: 'Unstable Ground', distance: '1.2km', severity: 'medium' }
      ];
    } else if (risk.level === 'medium') {
      risk.threats = [
        { type: 'Heavy Rain Expected', distance: '5km', severity: 'medium' }
      ];
    }

    return risk;
  }, []);

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(newLocation);
        
        // Perform AI risk assessment
        const risk = assessAreaRisk(newLocation.latitude, newLocation.longitude);
        setAreaRisk(risk);
        setNearbyThreats(risk.threats);
        
        setLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  }, [assessAreaRisk]);

  // Start monitoring location when component mounts
  useEffect(() => {
    getCurrentLocation();
    
    // Update location and risk assessment every 5 minutes
    const interval = setInterval(getCurrentLocation, 300000);
    
    return () => clearInterval(interval);
  }, [getCurrentLocation]);

  const getRiskColor = (level) => {
    switch (level) {
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
          Location Services
        </Typography>
        <Typography color="textSecondary" paragraph>
          Real-time location monitoring and risk assessment
        </Typography>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {location && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <LocationOn sx={{ mr: 1, verticalAlign: 'bottom' }} />
              Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Typography>

            {areaRisk && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Area Risk Assessment
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Risk Level: ${areaRisk.level.toUpperCase()}`}
                    color={getRiskColor(areaRisk.level)}
                    icon={<Warning />}
                    sx={{ mb: 1 }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={areaRisk.score}
                    color={getRiskColor(areaRisk.level)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    Risk Score: {areaRisk.score}%
                  </Typography>
                </Box>

                {nearbyThreats.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Nearby Threats:
                    </Typography>
                    {nearbyThreats.map((threat, index) => (
                      <Chip
                        key={index}
                        label={`${threat.type} (${threat.distance})`}
                        color={getRiskColor(threat.severity)}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        <Button
          variant="contained"
          startIcon={<MyLocation />}
          onClick={getCurrentLocation}
          disabled={loading}
          fullWidth
        >
          Update Location
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationServices;
