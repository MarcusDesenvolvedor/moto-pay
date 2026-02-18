/**
 * Serviço de upload direto ao Cloudinary (unsigned).
 * Usa upload preset - não expõe API secret no frontend.
 * @see https://cloudinary.com/documentation/upload_images#unsigned_upload
 */

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class CloudinaryUploadError extends Error {
  constructor(
    message: string,
    public readonly code?: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'UPLOAD_FAILED',
  ) {
    super(message);
    this.name = 'CloudinaryUploadError';
  }
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

function getConfig() {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new CloudinaryUploadError(
      'Configuração do Cloudinary incompleta. Verifique EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME e EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET.',
      'UPLOAD_FAILED',
    );
  }

  return { cloudName, uploadPreset };
}

function validateFileType(type: string): void {
  if (!ALLOWED_TYPES.includes(type.toLowerCase())) {
    throw new CloudinaryUploadError(
      `Tipo de arquivo não permitido. Use: ${ALLOWED_TYPES.join(', ')}`,
      'INVALID_TYPE',
    );
  }
}

function validateFileSize(size: number): void {
  if (size > MAX_FILE_SIZE_BYTES) {
    throw new CloudinaryUploadError(
      `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`,
      'FILE_TOO_LARGE',
    );
  }
}

/**
 * Upload de imagem para o Cloudinary via API REST (unsigned).
 * @param fileUri - URI local (file://) ou blob URL (web)
 * @param folder - Pasta opcional (via upload preset)
 * @returns secure_url da imagem
 */
export async function uploadImageToCloudinary(
  fileUri: string,
  folder?: string,
): Promise<string> {
  const { cloudName, uploadPreset } = getConfig();

  const formData = new FormData();
  const isWeb =
    typeof window !== 'undefined' &&
    (fileUri.startsWith('blob:') || fileUri.startsWith('data:'));

  if (isWeb) {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    validateFileType(blob.type);
    validateFileSize(blob.size);
    formData.append('file', new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
  } else {
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as unknown);
  }

  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  const url = `${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/upload`;
  const uploadResponse = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errData = await uploadResponse.json().catch(() => ({}));
    throw new CloudinaryUploadError(
      errData?.error?.message || `Upload falhou: ${uploadResponse.status}`,
      'UPLOAD_FAILED',
    );
  }

  const result = (await uploadResponse.json()) as CloudinaryUploadResult;
  if (!result?.secure_url) {
    throw new CloudinaryUploadError('Cloudinary não retornou URL', 'UPLOAD_FAILED');
  }

  return result.secure_url;
}
