import React from 'react';
import { Drawer, IconButton, styled } from '@mui/material';
import { Theme } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAtom } from 'jotai';
import { inspectorDrawerOpenAtom } from '../state/atoms';

const DRAWER_WIDTH = 320;

const DrawerHeader = styled('div')<{ theme?: Theme }>(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export function InspectorDrawer() {
  const [open, setOpen] = useAtom(inspectorDrawerOpenAtom);

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={() => setOpen(false)}>
          <ChevronRightIcon />
        </IconButton>
      </DrawerHeader>
      {/* Inspector content will go here */}
    </Drawer>
  );
}
