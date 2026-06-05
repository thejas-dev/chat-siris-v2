import axiosClient from "./axiosClient";
import { mediaUploadInitRoute, mediaUploadCompleteRoute } from "./ApiRoutes";

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

export function dataUrlToFile(dataUrl, fileName) {
  const parts = dataUrl.split(",");
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], fileName, { type: mime });
}

function normalizeFolder(folder) {
  if (!folder) {
    return undefined;
  }
  return folder.startsWith("/") ? folder : `/${folder}`;
}

/**
 * Direct browser upload to ImageKit (signed params from media-service).
 * Do not use the Node `imagekit` SDK here — it requires a private key.
 */
function normalizeImageKitPublicKey(key) {
  const trimmed = String(key ?? "").trim();
  if (trimmed.startsWith("public_") && !trimmed.endsWith("=")) {
    return `${trimmed}=`;
  }
  return trimmed;
}

async function uploadFileToImageKit(file, fileName, init) {
  const form = new FormData();
  form.append("file", file);
  form.append("fileName", fileName);
  form.append("publicKey", normalizeImageKitPublicKey(init.publicKey));
  form.append("signature", init.signature);
  form.append("token", init.token);
  form.append("expire", String(init.expire));
  const folder = normalizeFolder(init.folder);
  if (folder) {
    form.append("folder", folder);
  }

  const response = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    body: form,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail =
      body?.message || body?.error || JSON.stringify(body) || response.statusText;
    throw new Error(`ImageKit upload failed (${response.status}): ${detail}`);
  }
  if (!body?.url) {
    throw new Error("ImageKit upload response missing url");
  }
  return body.url;
}

/**
 * Upload a file via gateway upload-init → ImageKit (signed) → upload-complete.
 * @param {string} dataUrl - base64 data URL from FileReader
 * @param {"Audios"|"Videos"|"Pdfs"|"Zips"|"Codes"|"Images"} folder
 * @param {string} fileName
 * @returns {Promise<string>} CDN URL
 */
export async function uploadMediaFromDataUrl(dataUrl, folder, fileName) {
  const file = dataUrlToFile(dataUrl, fileName);
  const { data } = await axiosClient.post(mediaUploadInitRoute, {
    fileName,
    mimeType: file.type,
    folder,
    sizeBytes: file.size,
  });

  const init = data?.uploadId ? data : data?.data;
  if (!init?.uploadId || !init?.signature || !init?.token) {
    throw new Error("upload-init returned invalid signing payload");
  }

  const url = await uploadFileToImageKit(file, fileName, init);

  await axiosClient.post(mediaUploadCompleteRoute, {
    uploadId: init.uploadId,
    url,
  });

  return url;
}
