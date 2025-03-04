import React, { useState, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Alert } from '@mui/material';
import { PhotoCamera, Upload } from '@mui/icons-material';
import Webcam from 'react-webcam';
import axios from 'axios';

const DisasterDetection = () => {
  const [mode, setMode] = useState('upload'); // 'upload' or 'camera'
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const webcamRef = useRef(null);
  const monitoringInterval = useRef(null);

  const startMonitoring = () => {
    setIsMonitoring(true);
    monitoringInterval.current = setInterval(() => {
      captureAndAnalyze();
    }, 5000); // Analyze every 5 seconds
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
    }
  };

  const captureAndAnalyze = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          // Convert base64 to blob
          const base64Data = imageSrc.split(',')[1];
          const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
          
          const formData = new FormData();
          formData.append('file', blob, 'webcam-image.jpg');

          const response = await axios.post('http://localhost:5000/predict', formData);
          setPrediction(response.data);
          
          // Alert if disaster detected with high confidence
          if (response.data.confidence > 90 && response.data.class !== 'Normal') {
            new Notification('Disaster Alert!', {
              body: `Detected ${response.data.class} with ${response.data.confidence.toFixed(2)}% confidence`,
              icon: '/alert-icon.png'
            });
          }
        } catch (err) {
          setError('Error analyzing image: ' + err.message);
        }
      }
    }
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('http://localhost:5000/predict', formData);
        setPrediction(response.data);
      } catch (err) {
        setError('Error analyzing image: ' + err.message);
      }
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Disaster Detection
        </Typography>
        <Typography color="textSecondary" paragraph>
          Upload an image or take a photo to detect potential disasters in your area
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant={mode === 'upload' ? 'contained' : 'outlined'}
                onClick={() => setMode('upload')}
                startIcon={<Upload />}
                sx={{ mr: 1 }}
              >
                Upload Image
              </Button>
              <Button
                variant={mode === 'camera' ? 'contained' : 'outlined'}
                onClick={() => setMode('camera')}
                startIcon={<PhotoCamera />}
              >
                Use Camera
              </Button>
            </Box>

            {mode === 'upload' ? (
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{ width: '100%', borderRadius: '4px' }}
                />
                <Button
                  variant={isMonitoring ? 'contained' : 'outlined'}
                  color={isMonitoring ? 'error' : 'primary'}
                  onClick={isMonitoring ? stopMonitoring : startMonitoring}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  {isMonitoring ? 'Stop Monitoring' : 'Start Real-time Monitoring'}
                </Button>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {prediction && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Analysis Results:
                </Typography>
                <Typography variant="body1" paragraph>
                  Detected: {prediction.class}
                </Typography>
                <Typography variant="body1" paragraph>
                  Confidence: {prediction.confidence.toFixed(2)}%
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  All Probabilities:
                </Typography>
                {Object.entries(prediction.all_probabilities).map(([className, prob]) => (
                  <Typography key={className} variant="body2">
                    {className}: {prob.toFixed(2)}%
                  </Typography>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DisasterDetection;
