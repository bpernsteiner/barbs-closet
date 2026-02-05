import { ClothingItem } from './types';

const STORAGE_KEY = 'barbas-closet-wardrobe';

export function getWardrobe(): ClothingItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWardrobe(items: ClothingItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addItem(item: ClothingItem): ClothingItem[] {
  const items = getWardrobe();
  items.push(item);
  saveWardrobe(items);
  return items;
}

export function updateItem(updated: ClothingItem): ClothingItem[] {
  const items = getWardrobe().map(item =>
    item.id === updated.id ? updated : item
  );
  saveWardrobe(items);
  return items;
}

export function deleteItem(id: string): ClothingItem[] {
  const items = getWardrobe().filter(item => item.id !== id);
  saveWardrobe(items);
  return items;
}

export function logWear(id: string): ClothingItem[] {
  const items = getWardrobe().map(item => {
    if (item.id === id) {
      return {
        ...item,
        wearCount: item.wearCount + 1,
        lastWorn: new Date().toISOString(),
      };
    }
    return item;
  });
  saveWardrobe(items);
  return items;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
