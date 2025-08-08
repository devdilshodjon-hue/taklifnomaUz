import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// UUID format tekshirish
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Demo UUID yaratish
export function generateDemoUUID(): string {
  // Demo UUID pattern: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'demo0000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');
}

// Demo ID ekanligini tekshirish
export function isDemoId(id: string): boolean {
  return id.startsWith('demo') || id.startsWith('inv-') || !isValidUUID(id);
}

// Slug dan UUID yaratish (demo uchun)
export function generateUUIDFromSlug(slug: string): string {
  // Slug dan deterministic UUID yaratish
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer ga aylantirish
  }
  
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `demo0000-0000-4000-8000-${hex}${hex}`;
}
