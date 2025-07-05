// https://api.scryfall.com
// import { ScryfallApiResponse } from '@/types/scryfall';

export async function fetchCardByName(cardName: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      },
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const imageUrl = data.image_uris?.art_crop || data.card_faces?.[0]?.image_uris?.art_crop;

    return imageUrl;
  } catch (err) {
    console.error('fetchCardByName failed:', err);
  }
}

export async function fetchRulingsByName(
  cardName: string,
): Promise<{ rulings: any[]; cardName: string } | undefined> {
  try {
    // First, get the card to find its rulings_uri
    const cardRes = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`,
    );
    if (!cardRes.ok) throw new Error(`Card not found: ${cardRes.status}`);
    const cardData = await cardRes.json();
    const rulingsUri = cardData.rulings_uri;
    const officialCardName = cardData.name;

    if (!rulingsUri) return { rulings: [], cardName: officialCardName }; // No rulings for this card

    // Then, fetch the rulings from the URI
    const rulingsRes = await fetch(rulingsUri);
    if (!rulingsRes.ok) throw new Error(`Failed to fetch rulings: ${rulingsRes.status}`);
    const rulingsData = await rulingsRes.json();

    return { rulings: rulingsData.data, cardName: officialCardName }; // The rulings are in the 'data' property
  } catch (err) {
    console.error('fetchRulingsByName failed:', err);
  }
}
