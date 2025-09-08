import { checkObjectExists, generateSignedUrl } from "../storage/gcs.js";
import { isVideo } from "./file.js";
import { env } from "../config/env.js";

export const generateObjectPath = async (clientId, media) => {
  let objectPath = `${clientId}/processed/${media._id}/${media._id}.${media.formats.processed[0]}`;

  if (isVideo(media.mimetype)) {
    objectPath = `${clientId}/processed/${media._id}/${media.resolutions[0]}p/index.m3u8`;

    if (!await checkObjectExists(objectPath)) {
      objectPath = `${clientId}/raw/${media._id}.${media.formats.raw}`;
      return await generateSignedUrl(objectPath);
    }

    objectPath = `${env.BACKEND_URL}/media/${media._id}/playlist`;

    return objectPath;
  }

  if (!await checkObjectExists(objectPath)) {
    objectPath = `${clientId}/raw/${media._id}.${media.formats.raw}`;
  }

  return objectPath;
}

export const generateObjectPaths = async (clientId, media) => {
  const rawPath = `${clientId}/raw/${media._id}.${media.formats.raw}`;
  const rawUrl = await generateSignedUrl(rawPath);

  let processedUrl = null;

  if (isVideo(media.mimetype)) {
    const hlsPath = `${clientId}/processed/${media._id}/${media.resolutions[0]}p/index.m3u8`;

    if (await checkObjectExists(hlsPath)) {
      processedUrl = `${env.BACKEND_URL}/media/${media._id}/playlist`;
    }
  } else {
    const processedPath = `${clientId}/processed/${media._id}/${media._id}.${media.formats.processed?.[0]}`;
    if (media.formats.processed?.length > 0 && await checkObjectExists(processedPath)) {
      processedUrl = await generateSignedUrl(processedPath);
    }
  }

  return { raw: rawUrl, processed: processedUrl };
}
