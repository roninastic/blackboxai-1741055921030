import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Phone, LocalHospital, LocalPolice, Fireplace, Share } from '@mui/icons-material';

const EmergencyContacts = () => {
  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', icon: <Phone color="error" /> },
    { name: 'Local Hospital', number: '555-0123', icon: <LocalHospital color="primary" /> },
    { name: 'Police Department', number: '555-0124', icon: <LocalPolice color="info" /> },
    { name: 'Fire Department', number: '555-0125', icon: <Fireplace color="error" /> },
  ];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleShare = (contact) => {
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Contact',
        text: `${contact.name}: ${contact.number}`,
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Emergency Contacts
        </Typography>
        <Typography color="textSecondary" paragraph>
          Quick access to emergency contacts
        </Typography>

        <List>
          {emergencyContacts.map((contact) => (
            <ListItem
              key={contact.name}
              button
              onClick={() => handleCall(contact.number)}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleShare(contact)}>
                  <Share />
                </IconButton>
              }
            >
              <ListItemIcon>
                {contact.icon}
              </ListItemIcon>
              <ListItemText
                primary={contact.name}
                secondary={contact.number}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
