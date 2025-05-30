import React from 'react';
import { Drawer, IconButton, styled } from '@mui/material';
import { Theme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useAtom } from 'jotai';
import { samplesDrawerOpenAtom } from '../state/atoms';

const DRAWER_WIDTH = 320;

const DrawerHeader = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export function SamplesDrawer() {
  const [open, setOpen] = useAtom(samplesDrawerOpenAtom);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
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
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      {/* Samples content will go here */}
    </Drawer>
  );
}
