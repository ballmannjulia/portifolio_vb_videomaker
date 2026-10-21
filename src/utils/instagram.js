export function buildInstagramHref(value) {
  const instagram = (value || '').trim();

  if (/^https?:\/\//i.test(instagram)) return instagram;

  const username = instagram.replace(/^@/, '');
  return `https://www.instagram.com/${encodeURIComponent(username)}/`;
}
