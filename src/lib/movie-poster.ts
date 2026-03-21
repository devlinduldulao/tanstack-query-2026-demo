export function getMoviePosterUrl(imageUrl: string) {
  if (import.meta.env.DEV) {
    return `/__movie-poster?url=${encodeURIComponent(imageUrl)}`;
  }

  return imageUrl;
}
