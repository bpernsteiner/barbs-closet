export type Category = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';

export interface ClothingItem {
  id: string;
  name: string;
  imageBase64: string;
  category: Category;
  color: string;
  texture: string;
  style: string;
  occasions: string[];
  wearCount: number;
  lastWorn: string | null;
  dateAdded: string;
}

export interface OutfitSuggestion {
  items: ClothingItem[];
  occasion: string;
  reasoning: string;
  weatherAppropriate: boolean;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  city: string;
}

export interface AnalysisResult {
  name: string;
  category: Category;
  color: string;
  texture: string;
  style: string;
  occasions: string[];
}
