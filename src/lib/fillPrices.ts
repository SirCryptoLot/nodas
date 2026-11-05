// Straipsniuose {{kaina:paslauga}} pakeičiama tikra kaina iš catalog.ts.
import { priceText } from '../data/catalog.ts';

export function fillPrices(text: string): string {
  return text.replace(/\{\{kaina:([a-z-]+)\}\}/g, (_, slug: string) => priceText(slug));
}
