import { useAtom } from 'jotai';
import { inspectorDrawerOpenAtom, samplesDrawerOpenAtom } from './atoms';

export function useInspectorDrawerOpen() {
  const [open] = useAtom(inspectorDrawerOpenAtom);
  return open;
}

export function useSamplesDrawerOpen() {
  const [open] = useAtom(samplesDrawerOpenAtom);
  return open;
}
