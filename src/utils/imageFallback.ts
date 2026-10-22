import React from 'react';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Jackets & Hoodies': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  'Jackets & Outerwear': 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
  'Traditional & Ethnic Wear': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'Ethnic & Festive Wear': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'Shirts & Tops': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  'Jeans & Trousers': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  'Dresses & Jumpsuits': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
  'Knitwear & Sweaters': 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
};

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

// Known broken Unsplash image URLs to map to verified functional URLs
const BROKEN_URL_MAP: Record<string, string> = {
  'https://images.unsplash.com/photo-1621786030685-2c96c4297805': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
};

export function getSafeImageUrl(url?: string | null, category?: string): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return CATEGORY_FALLBACK_IMAGES[category || ''] || CATEGORY_FALLBACK_IMAGES.default;
  }

  // Check if it's the known broken Unsplash ID
  for (const [brokenPrefix, replacement] of Object.entries(BROKEN_URL_MAP)) {
    if (url.includes(brokenPrefix)) {
      return replacement;
    }
  }

  // If it's a broken template string like photo-${1534528741775
  if (url.includes('${') || url.endsWith('photo-')) {
    return DEFAULT_AVATAR;
  }

  return url;
}

export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  category?: string
) {
  const target = event.currentTarget;
  // Prevent infinite error recursion if fallback also has issues
  target.onerror = null;
  target.src = CATEGORY_FALLBACK_IMAGES[category || ''] || CATEGORY_FALLBACK_IMAGES.default;
}

export function handleAvatarError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = event.currentTarget;
  target.onerror = null;
  target.src = DEFAULT_AVATAR;
}
