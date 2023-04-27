import { Store } from '../types/store';

export const defaultStore = {
  children: [],
};

export async function getStore() {
  return ((await chrome.storage.local.get('store'))?.store ?? defaultStore) as Store;
}

export async function saveStore(store: Store) {
  await chrome.storage.local.set({ store: store });
}
