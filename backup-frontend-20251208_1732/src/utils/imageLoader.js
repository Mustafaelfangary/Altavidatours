// Custom image loader for Next.js with error handling
export default function imageLoader({ src, width, quality }) {
  // Handle absolute external URLs without rewriting
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  let normalizedSrc = src;

  // Assets that live at the public root (not under /images)
  const isRootStaticAsset =
    src.startsWith('/icons/') ||
    src.startsWith('/AppIcons/') ||
    src.startsWith('/videos/') ||
    src.startsWith('/flags/') ||
    src.startsWith('/favicon') ||
    src.startsWith('/manifest');

  // Only auto-prefix /images for paths that are meant to live in /public/images
  if (!isRootStaticAsset) {
    // If it's already a full path starting with /images/, keep as is
    if (src.startsWith('/images/')) {
      normalizedSrc = src;
    }
    // If it starts with /, assume it's missing the /images prefix
    else if (src.startsWith('/')) {
      normalizedSrc = `/images${src}`;
    }
    // If it doesn't start with /, treat it as a relative image inside /images
    else {
      normalizedSrc = `/images/${src}`;
    }
  }

  // For images under /images, use the API route for extra validation / fallbacks
  if (normalizedSrc.startsWith('/images/')) {
    const params = new URLSearchParams({
      path: normalizedSrc.replace('/images/', ''),
      width: width.toString(),
      quality: (quality || 75).toString(),
    });

    return `/api/image?${params.toString()}`;
  }

  // For other local assets (icons, app icons, etc.), return a direct path
  return `${normalizedSrc}?w=${width}&q=${quality || 75}`;
}
