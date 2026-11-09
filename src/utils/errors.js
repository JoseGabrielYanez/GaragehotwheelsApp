/** Mensaje para el usuario a partir de un error de axios: distingue "sin conexión" de un rechazo del servidor. */
export function getErrorMessage(error, fallback) {
  if (!error?.response) return "No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.";
  return error.response.data?.message || fallback;
}
