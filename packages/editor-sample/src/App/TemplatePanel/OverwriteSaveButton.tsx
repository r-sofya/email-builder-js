import React, { useState } from 'react';
import { SaveOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Snackbar } from '@mui/material';
import { useDocument, useCurrentTemplateKey } from '../../documents/editor/EditorContext';

function saveTemplateToLocalStorage(key: string, doc: any) {
  localStorage.setItem(key, JSON.stringify(doc));
}

export default function OverwriteSaveButton() {
  const document = useDocument();
  const currentTemplateKey = useCurrentTemplateKey();
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const handleSave = () => {
    if (currentTemplateKey) {
      saveTemplateToLocalStorage(currentTemplateKey, document);
      setSnackbar('Template saved!');
    }
  };

  return (
    <>
      <Tooltip title="Save current template">
        <IconButton onClick={handleSave} disabled={!currentTemplateKey}>
          <SaveOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </>
  );
}
