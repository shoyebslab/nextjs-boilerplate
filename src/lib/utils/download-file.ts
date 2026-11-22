export interface DownloadFileOptions {
  url: string;
  fileName?: string;
  token?: string;
  headers?: Record<string, string>;
}

/**
 * Downloads a file via fetch with authentication headers and triggers browser download
 */
export async function downloadFile({
  url,
  fileName = "download",
  token,
  headers = {},
}: DownloadFileOptions): Promise<boolean> {
  const requestHeaders: Record<string, string> = { ...headers };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    credentials: "include",
    headers: Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Unable to download file (Status ${response.status})`);
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
  return true;
}

/**
 * Trigger download of raw text or blob directly on client side (e.g. CSV, JSON, TXT)
 */
export function downloadClientBlob(
  content: BlobPart,
  fileName: string,
  mimeType: string = "text/plain;charset=utf-8"
): void {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}
