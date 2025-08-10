import { checkObjectExists, generateSignedUrl } from '../storage/minio.js';

export const generateSignedPlaylist = async (clientId, mediaId) => {
  const indexObjectPath = `${clientId}/processed/${mediaId}/480p/index.m3u8`;
  if (!await checkObjectExists(indexObjectPath)) {
    return null;
  }
  const originalPlaylist = await (await fetch(await generateSignedUrl(indexObjectPath))).text();

  const lines = originalPlaylist.split('\n');

  const updatedLines = await Promise.all(
    lines.map(async line => {
      if (line.endsWith('.ts')) {
        const segmentPath = `${clientId}/processed/${mediaId}/480p/${line}`;
        const signedUrl = await generateSignedUrl(segmentPath);
        return signedUrl;
      }
      return line;
    })
  );

  const signedPlaylist = updatedLines.join('\n');

  return signedPlaylist;
}