export type UploadType = "avatar" | "logo" | "content";

/** Error shape returned by the upload API */
export interface UploadApiError {
  error: string;
}

/** Response from POST /api/upload */
export interface UploadPresignedResponse {
  /** Presigned PUT URL for direct upload to R2 */
  url: string;
  /** Object key in the bucket (e.g. avatars/yGE3_Yy8w6F5TFG-iiikk.webp) */
  key: string;
  /** Public URL to access the file after upload */
  publicUrl: string;
}
