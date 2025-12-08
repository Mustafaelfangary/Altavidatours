// This file was missing after the migration. Restoring a basic Next.js image loader.

export default function imageLoader({ src, width, quality }) {
  // Encode the src to handle spaces and special characters
  const encodedSrc = encodeURI(src);
  return `${encodedSrc}?w=${width}&q=${quality || 75}`;
}
