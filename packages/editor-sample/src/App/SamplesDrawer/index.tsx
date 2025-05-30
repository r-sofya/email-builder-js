import React, { useEffect, useState } from 'react';

import { Box, Button, Divider, Drawer, Link, Stack, Typography } from '@mui/material';

import { useSamplesDrawerOpen, resetDocument } from '../../documents/editor/EditorContext';

import logo from './waypoint.svg';
import EMPTY_EMAIL_MESSAGE from '../../getConfiguration/sample/empty-email-message';

export const SAMPLES_DRAWER_WIDTH = 240;

// Helper function to get saved templates from localStorage
function getSavedTemplates() {
  const templates: { name: string; key: string }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('emailbuilderjs_template_')) {
      const name = key.replace('emailbuilderjs_template_', '');
      templates.push({ name, key });
    }
  }
  return templates;
}

// Helper function to load a template from localStorage
function loadTemplateFromLocalStorage(key: string) {
  const item = localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch (e) {
      console.error(`Failed to parse template from localStorage for key ${key}:`, e);
      return null;
    }
  }
  return null;
}

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const [savedTemplates, setSavedTemplates] = useState<{ name: string; key: string }[]>([]);

  useEffect(() => {
    if (samplesDrawerOpen) {
      setSavedTemplates(getSavedTemplates());
    }
  }, [samplesDrawerOpen]); // Refresh list when drawer opens

  const handleTemplateClick = (key: string) => {
    const template = loadTemplateFromLocalStorage(key);
    if (template) {
      resetDocument(template); // Load the template into the editor and reset state
    }
  };

  const handleNewTemplate = () => {
    resetDocument(EMPTY_EMAIL_MESSAGE); // Load an empty template and reset state
    // Optionally close the drawer or navigate
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%">
        <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            Saved Templates
          </Typography>

          <Button size="small" variant="contained" onClick={handleNewTemplate}>
            Create New Template
          </Button>

          <Divider />

          <Stack alignItems="flex-start">
            {savedTemplates.map((template) => (
              <Button key={template.key} size="small" onClick={() => handleTemplateClick(template.key)}>
                {template.name}
              </Button>
            ))}
          </Stack>

          <Divider />

          <Stack>
            <Button size="small" href="https://www.usewaypoint.com/open-source/emailbuilderjs" target="_blank">
              Learn more
            </Button>
            <Button size="small" href="https://github.com/usewaypoint/email-builder-js" target="_blank">
              View on GitHub
            </Button>
          </Stack>
        </Stack>
        <Stack spacing={2} px={0.75} py={3}>
          <Link href="https://usewaypoint.com?utm_source=emailbuilderjs" target="_blank" sx={{ lineHeight: 1 }}>
            <Box component="img" src={logo} width={32} />
          </Link>
          <Box>
            <Typography variant="overline" gutterBottom>
              Looking to send emails?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Waypoint is an end-to-end email API with a &apos;pro&apos; version of this template builder with dynamic
              variables, loops, conditionals, drag and drop, layouts, and more.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ justifyContent: 'center' }}
            href="https://usewaypoint.com?utm_source=emailbuilderjs"
            target="_blank"
          >
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
