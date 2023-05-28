export function queryParam(key: string, secrets: string) {
  const firstIndex = secrets.indexOf(key);
  if (firstIndex === -1) return undefined;

  let lastIndex = secrets.indexOf("&", firstIndex);
  if (lastIndex === -1) return undefined;

  return secrets.substring(firstIndex + key.length + 1, lastIndex);
}
