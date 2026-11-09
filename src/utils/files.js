// Nombres de archivo de cámara/capturas que no sirven como nombre del auto
const GENERIC_FILE_NAME =
  /^(img|dsc|dscn|pxl|wp|mvimg|screenshot|captura|image|imagen|photo|foto|whatsapp image)[\s_-]*[\d\s_.-]*(at.*)?$/i;

/** Convierte "Mercedes-Benz_Unimog_1300L.png" en "Mercedes-Benz Unimog 1300L" ("" si no sirve). */
export function nameFromFile(filename = "") {
  const cleaned = filename
    .replace(/\.[^.]+$/, "")
    .replace(/_+/g, " ")
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || /^\d+$/.test(cleaned) || /\d{6,}/.test(cleaned) || GENERIC_FILE_NAME.test(cleaned)) return "";
  return cleaned;
}
