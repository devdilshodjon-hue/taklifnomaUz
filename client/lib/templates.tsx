import React from 'react';
import { Heart, Sparkles, Flower2, Diamond, Star, Crown, Gem, Leaf } from 'lucide-react';

export interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: 'classic' | 'modern' | 'elegant' | 'rustic' | 'luxury';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  icon: React.ReactNode;
}

export const weddingTemplates: TemplateData[] = [
  {
    id: 'classic-rose',
    name: 'Klassik Atirgul',
    description: 'Atirgul gullari bilan an\'anaviy va nafis dizayn',
    category: 'classic',
    preview: '🌹',
    colors: {
      primary: '#E11D48',
      secondary: '#F3F4F6',
      accent: '#FCD34D',
      background: '#FFFBEB',
      text: '#1F2937'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
      accent: 'Dancing Script'
    },
    icon: <Rose className="w-5 h-5" />
  },
  {
    id: 'modern-minimal',
    name: 'Zamonaviy Minimal',
    description: 'Toza chiziqlar va zamonaviy tipografiya',
    category: 'modern',
    preview: '💍',
    colors: {
      primary: '#3B82F6',
      secondary: '#F8FAFC',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#0F172A'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      accent: 'Inter'
    },
    icon: <Diamond className="w-5 h-5" />
  },
  {
    id: 'elegant-gold',
    name: 'Nafis Oltin',
    description: 'Oltin aksentlar bilan hashamatli dizayn',
    category: 'luxury',
    preview: '✨',
    colors: {
      primary: '#D97706',
      secondary: '#FEF3C7',
      accent: '#F59E0B',
      background: '#FFFEF7',
      text: '#1C1917'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Crimson Text',
      accent: 'Dancing Script'
    },
    icon: <Crown className="w-5 h-5" />
  },
  {
    id: 'rustic-nature',
    name: 'Qishloq Tabiat',
    description: 'Tabiiy elementlar va issiq ranglar',
    category: 'rustic',
    preview: '🌿',
    colors: {
      primary: '#059669',
      secondary: '#ECFDF5',
      accent: '#92400E',
      background: '#F7F7F7',
      text: '#374151'
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Open Sans',
      accent: 'Kaushan Script'
    },
    icon: <Flower2 className="w-5 h-5" />
  },
  {
    id: 'elegant-lavender',
    name: 'Nafis Lavanta',
    description: 'Binafsha ranglar bilan romantik atmosfera',
    category: 'elegant',
    preview: '💜',
    colors: {
      primary: '#7C3AED',
      secondary: '#F3F4F6',
      accent: '#EC4899',
      background: '#FAFAFA',
      text: '#374151'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lora',
      accent: 'Great Vibes'
    },
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 'modern-sunset',
    name: 'Zamonaviy Quyosh',
    description: 'Quyosh botishi ranglari bilan issiq dizayn',
    category: 'modern',
    preview: '🌅',
    colors: {
      primary: '#EA580C',
      secondary: '#FFF7ED',
      accent: '#F59E0B',
      background: '#FFFBF0',
      text: '#1C1917'
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Source Sans Pro',
      accent: 'Dancing Script'
    },
    icon: <Star className="w-5 h-5" />
  }
];

export const getTemplateById = (id: string): TemplateData | undefined => {
  return weddingTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): TemplateData[] => {
  return weddingTemplates.filter(template => template.category === category);
};

// Template kategoriyalari
export const templateCategories = [
  { id: 'all', name: 'Barchasi', count: weddingTemplates.length },
  { id: 'classic', name: 'Klassik', count: getTemplatesByCategory('classic').length },
  { id: 'modern', name: 'Zamonaviy', count: getTemplatesByCategory('modern').length },
  { id: 'elegant', name: 'Nafis', count: getTemplatesByCategory('elegant').length },
  { id: 'rustic', name: 'Qishloq', count: getTemplatesByCategory('rustic').length },
  { id: 'luxury', name: 'Hashamatli', count: getTemplatesByCategory('luxury').length },
];
