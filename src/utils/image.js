const MAX_SIDE = 1600;           // el servidor guarda como máximo ~1100 px: 1600 sobra para recortar bien
const SKIP_BELOW = 700 * 1024;   // las fotos ya livianas se suben tal cual

/**
 * Reduce las fotos grandes de cámara (p. ej. 12 MP, 4-8 MB) a ~1600 px y las re-codifica como JPEG
 * antes de subirlas: la subida es mucho más rápida y el servidor procesa menos píxeles.
 * Si algo falla o no conviene, devuelve el archivo original.
 */
export async function prepareImageForUpload(file) {
  if (!["image/jpeg", "image/webp"].includes(file.type) || file.size < SKIP_BELOW) return file;

  let url;
  try {
    url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode(); // el navegador aplica la orientación EXIF (fotos tomadas de lado)

    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
}
