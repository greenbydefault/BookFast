/**
 * Settings - Shared helpers across all settings sections
 */
import { getState, setState } from '../../../lib/store.js';
import { fetchEntity } from '../../../lib/dataLayer.js';
import { setStorageJson } from '../../../lib/storageService.js';

/**
 * Refresh current workspace data from DB
 */
export const refreshWorkspace = async () => {
  const state = getState();
  if (!state.currentWorkspace?.id) return;

  const workspace = await fetchEntity('workspaces', state.currentWorkspace.id);
  if (workspace) {
    setState({ currentWorkspace: workspace });
    setStorageJson('selectedWorkspace', workspace);
  }
};
