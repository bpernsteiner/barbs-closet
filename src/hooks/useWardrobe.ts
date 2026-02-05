'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClothingItem } from '@/lib/types';
import * as storage from '@/lib/storage';

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(storage.getWardrobe());
    setLoaded(true);
  }, []);

  const addItem = useCallback((item: ClothingItem) => {
    setItems(storage.addItem(item));
  }, []);

  const updateItem = useCallback((item: ClothingItem) => {
    setItems(storage.updateItem(item));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(storage.deleteItem(id));
  }, []);

  const logWear = useCallback((id: string) => {
    setItems(storage.logWear(id));
  }, []);

  return { items, loaded, addItem, updateItem, deleteItem, logWear };
}
