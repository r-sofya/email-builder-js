import React from 'react';
import { Paper, Typography } from '@mui/material';

export function TemplatePanel() {
  return (
    <Paper
      sx={{
        m: 2,
        p: 2,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6">Template Panel Content</Typography>
      {/* Template editing content will go here */}
    </Paper>
  );
}
