import React, { useState } from 'react';
import { SaveOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar } from '@mui/material';
import { useDocument } from '../../documents/editor/EditorContext';

function saveTemplateToLocalStorage(name: string, doc: any) {
  const key = `emailbuilderjs_template_${name}`;
  localStorage.setItem(key, JSON.stringify(doc));
}

export default function SaveButton() {
  const document = useDocument();
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const handleSave = () => {
    if (templateName.trim()) {
      saveTemplateToLocalStorage(templateName.trim(), document);
      setOpen(false);
      setSnackbar('Template saved!');
      setTemplateName('');
    }
  };

  return (
    <>
      <Tooltip title="Save as new template">
        <IconButton onClick={() => setOpen(true)}>
          <SaveOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Save Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!templateName.trim()}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </>
  );
}
