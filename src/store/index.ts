import { Store } from '../types/store';

export const defaultStore = {
  children: [],
};

export async function getStore() {
  return ((await chrome.storage.sync.get('store'))?.store ?? defaultStore) as Store;
}

export async function saveStore(store: Store) {
  await chrome.storage.sync.set({ store: store });
}
