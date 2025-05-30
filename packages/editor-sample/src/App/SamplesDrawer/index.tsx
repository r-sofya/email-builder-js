import React, { useEffect, useState } from 'react';

import { Box, Button, Divider, Drawer, Stack, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material'; // Import necessary components
import { DeleteOutline, EditOutlined } from '@mui/icons-material'; // Import icons

// Update the import path below to the correct location of EditorContext.tsx or .ts in your project structure
import { useSamplesDrawerOpen, loadDocumentAndSetKey, useCurrentTemplateKey, useDocument } from '../../documents/editor/EditorContext';

// TODO: Update the path below to the correct location of empty-email-message or define a fallback
import EMPTY_EMAIL_MESSAGE from '../../getConfiguration/sample/empty-email-message'; // Ensure this import points to a valid empty editor document

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

// Helper function to save a template to localStorage
function saveTemplateToLocalStorage(name: string, doc: any) {
  const key = `emailbuilderjs_template_${name}`;
  localStorage.setItem(key, JSON.stringify(doc));
  return key; // Return the key after saving
}

// Helper function to delete a template from localStorage
function deleteTemplateFromLocalStorage(key: string) {
  localStorage.removeItem(key);
}

// Helper function to check if a template exists
function templateExists(name: string): boolean {
  const key = `emailbuilderjs_template_${name}`;
  return localStorage.getItem(key) !== null;
}

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const currentTemplateKey = useCurrentTemplateKey(); // Get the current template key
  const document = useDocument(); // Get the current document
  const [savedTemplates, setSavedTemplates] = useState<{ name: string; key: string }[]>([]);
  const [newTemplateDialogOpen, setNewTemplateDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // State for delete confirmation dialog
  const [templateToDelete, setTemplateToDelete] = useState<{ name: string; key: string } | null>(null); // State for template to delete
  const [renameDialogOpen, setRenameDialogOpen] = useState(false); // State for rename dialog
  const [templateToRename, setTemplateToRename] = useState<{ name: string; key: string } | null>(null); // State for template to rename
  const [newTemplateRename, setNewTemplateRename] = useState(''); // State for new rename name
  const [renameError, setRenameError] = useState<string | null>(null); // State for rename error

  useEffect(() => {
    if (samplesDrawerOpen) {
      setSavedTemplates(getSavedTemplates());
    }
  }, [samplesDrawerOpen]); // Refresh list when drawer opens

  const handleTemplateClick = (key: string) => {
    const template = loadTemplateFromLocalStorage(key);
    if (template) {
      loadDocumentAndSetKey(template, key); // Load the template and set the key
    }
  };

  const handleNewTemplateClick = () => {
    setNewTemplateDialogOpen(true);
  };

  const handleNewTemplateSave = () => {
    const name = newTemplateName.trim();
    if (name) {
      const key = saveTemplateToLocalStorage(name, document); // Save current document
      setSavedTemplates(getSavedTemplates()); // Refresh the list
      const newTemplate = loadTemplateFromLocalStorage(key); // Load the newly saved template
      if (newTemplate) {
        loadDocumentAndSetKey(newTemplate, key); // Load and set key
      }
      setNewTemplateDialogOpen(false);
      setNewTemplateName('');
    }
  };

  const handleNewTemplateDialogClose = () => {
    setNewTemplateDialogOpen(false);
    setNewTemplateName('');
  };

  const handleDeleteClick = (template: { name: string; key: string }) => {
    setTemplateToDelete(template);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      deleteTemplateFromLocalStorage(templateToDelete.key);
      setSavedTemplates(getSavedTemplates()); // Refresh the list
      if (currentTemplateKey === templateToDelete.key) {
        loadDocumentAndSetKey(EMPTY_EMAIL_MESSAGE, null); // Load empty if current is deleted
      }
      setDeleteConfirmOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setTemplateToDelete(null);
  };

  const handleRenameClick = (template: { name: string; key: string }) => {
    setTemplateToRename(template);
    setNewTemplateRename(template.name); // Set initial value to current name
    setRenameError(null); // Clear previous errors
    setRenameDialogOpen(true);
  };

  const handleRenameSave = () => {
    const newName = newTemplateRename.trim();
    if (!newName) {
      setRenameError('Name cannot be empty');
      return;
    }
    if (templateExists(newName) && newName !== templateToRename?.name) {
      setRenameError(`Template "${newName}" already exists`);
      return;
    }

    if (templateToRename) {
      const currentDoc = loadTemplateFromLocalStorage(templateToRename.key); // Load the content
      if (currentDoc) {
        deleteTemplateFromLocalStorage(templateToRename.key); // Delete old
        const newKey = saveTemplateToLocalStorage(newName, currentDoc); // Save with new name
        setSavedTemplates(getSavedTemplates()); // Refresh list
        if (currentTemplateKey === templateToRename.key) {
          loadDocumentAndSetKey(currentDoc, newKey); // Load with new key if it was current
        }
      }
      setRenameDialogOpen(false);
      setTemplateToRename(null);
      setNewTemplateRename('');
      setRenameError(null);
    }
  };

  const handleRenameDialogClose = () => {
    setRenameDialogOpen(false);
    setTemplateToRename(null);
    setNewTemplateRename('');
    setRenameError(null);
  };
  return (
      <Drawer
        variant="persistent"
        anchor="left"
        open={samplesDrawerOpen}
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            overflow: 'hidden', // Prevent all overflow
          },
        }}
      >
        <Stack
          spacing={3}
          py={1}
          px={2}
          width={SAMPLES_DRAWER_WIDTH}
          justifyContent="space-between"
          height="100%"
          sx={{ overflow: 'hidden' }} // Prevent overflow in Stack
        >
          <Stack spacing={2} sx={{
            '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' },
            '& .MuiIconButton-root': { width: 'auto' }, // Prevent IconButton from stretching
          }}>
            <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
              Saved Designs
            </Typography>

            <Button size="small" variant="contained" onClick={handleNewTemplateClick}>
              New Email Design
            </Button>

            <Divider />

            <Stack alignItems="flex-start" sx={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto', width: '100%' }}>
              {savedTemplates.map((template) => (
                <Stack direction="row" justifyContent="space-between" alignItems="center" key={template.key} sx={{ width: '100%' }}>
                  <Button
                    size="small"
                    onClick={() => handleTemplateClick(template.key)}
                    sx={{
                      fontWeight: template.key === currentTemplateKey ? 'bold' : 'normal',
                      justifyContent: 'flex-start',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                      maxWidth: '120px',
                    }}
                  >
                    {template.name}
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleRenameClick(template)}
                      aria-label="rename"
                      sx={{
                        width: 32,
                        height: 32,
                        minWidth: 32,
                        minHeight: 32,
                        maxWidth: 32,
                        maxHeight: 32,
                        p: 0,
                        ml: 0.5,
                        borderRadius: 1,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <EditOutlined fontSize="small" sx={{ mx: 'auto', my: 'auto', display: 'block' }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(template)}
                      aria-label="delete"
                      sx={{
                        width: 32,
                        height: 32,
                        minWidth: 32,
                        minHeight: 32,
                        maxWidth: 32,
                        maxHeight: 32,
                        p: 0,
                        ml: 0.5,
                        borderRadius: 1,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DeleteOutline fontSize="small" sx={{ mx: 'auto', my: 'auto', display: 'block' }} />
                    </IconButton>
                  </Box>
                </Stack>
              ))}
            </Stack>

            {/* Removed the Divider and the following Stack with Learn more and View on GitHub buttons */}

          </Stack>
          {/* Removed the Stack with Waypoint promotion */}
        </Stack>

        {/* New Template Name Dialog */}
        <Dialog open={newTemplateDialogOpen} onClose={handleNewTemplateDialogClose}>
          <DialogTitle>New Email Design</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Design Name"
              fullWidth
              value={newTemplateName}
              onChange={e => setNewTemplateName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleNewTemplateSave(); }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewTemplateDialogClose}>Cancel</Button>
            <Button onClick={handleNewTemplateSave} variant="contained" disabled={!newTemplateName.trim()}>
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the template "{templateToDelete?.name}"?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Rename Dialog */}
        <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
          <DialogTitle>Rename Email Design</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Design Name"
              fullWidth
              value={newTemplateRename}
              onChange={e => setNewTemplateRename(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRenameSave(); }}
              error={!!renameError}
              helperText={renameError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRenameDialogClose}>Cancel</Button>
            <Button onClick={handleRenameSave} variant="contained" disabled={!newTemplateRename.trim()}>Rename</Button>
          </DialogActions>        </Dialog>
      </Drawer>
  );
}
