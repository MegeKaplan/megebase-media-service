import { checkObjectExists, generateSignedUrl } from "../storage/minio.js";
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