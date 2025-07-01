import { openDB } from 'idb';

const DB_NAME = 'stories-db';
const STORE_NAME = 'favorites';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export async function saveFavorite(story) {
  const db = await dbPromise;
  return db.put(STORE_NAME, story);
}

export async function deleteFavorite(id) {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
}

export async function isFavorited(id) {
  const db = await dbPromise;
  const data = await db.get(STORE_NAME, id);
  return !!data;
}

export async function getAllFavorites() {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
}
