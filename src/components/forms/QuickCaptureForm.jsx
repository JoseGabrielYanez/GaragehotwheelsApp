import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { api } from "../../api";
import { prepareImageForUpload } from "../../utils/image";
import FormPanel from "./FormPanel";
import { dropZoneClass, hintClass, labelClass, submitClass } from "./styles";
import { getErrorMessage } from "../../utils/errors";

/** Foto rápida con la cámara del teléfono (solo se muestra en móvil / pantallas táctiles). */
export default function QuickCaptureForm({ onStart, onCreated, onFail }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const lastOpen = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // El botón de cámara de la barra inferior lleva hasta este formulario y abre la cámara
  useEffect(() => {
    const open = () => {
      document.getElementById("foto-rapida")?.scrollIntoView({ behavior: "smooth", block: "center" });
      try {
        inputRef.current?.click();
      } catch {
        // si el navegador bloquea la apertura, el formulario queda a la vista para tocar "Tomar foto"
      }
    };

    window.addEventListener("open-camera", open);

    const requested = location.state?.openCamera;
    if (requested && lastOpen.current !== requested) {
      lastOpen.current = requested;
      open();
      navigate(location.pathname, { replace: true, state: null });
    }

    return () => window.removeEventListener("open-camera", open);
  }, [location.state, location.pathname, navigate]);

  function handleFile(picked) {
    if (!picked) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setDone(false);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (!file) return;

    setSaving(true);
    setError("");
    const finalName = name.trim() || "Auto sin nombre";
    const pendingId = onStart?.({ name: finalName, notes: "", previewUrl: preview });

    try {
      const body = new FormData();
      body.append("image", await prepareImageForUpload(file));
      body.append("name", finalName);
      body.append("notes", "");

      const { data } = await api.post("/cars", body, { headers: { "Content-Type": "multipart/form-data" } });
      onCreated(data.car, pendingId);
      URL.revokeObjectURL(preview);
      setFile(null);
      setPreview("");
      setName("");
      setDone(true);
      setTimeout(() => setDone(false), 3500);
    } catch (err) {
      onFail?.(pendingId);
      setError(getErrorMessage(err, "No se pudo guardar. Intenta de nuevo."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormPanel
      id="foto-rapida"
      className="hidden compact:block"
      onSubmit={submit}
      kicker="Foto rápida"
      title="Usar la cámara"
      icon={<Camera size={20} />}
    >
      <label className={`${dropZoneClass} min-h-48`}>
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={(event) => {
            const picked = event.target.files?.[0];
            event.target.value = "";
            handleFile(picked);
          }}
        />
        {preview ? (
          <img className="h-56 w-full object-cover" src={preview} alt="Foto tomada" />
        ) : (
          <span className="grid place-items-center gap-[0.55rem] font-semibold text-[#d9a073]">
            <Camera size={44} strokeWidth={1.6} />
            <span className="text-[#cfd0d6] light:text-[#4a4f5d]">Tomar foto</span>
          </span>
        )}
      </label>
      {preview && <small className={hintClass}>Toca la foto para tomarla de nuevo.</small>}

      <label className={labelClass}>
        Nombre (opcional)
        <input
          className="field font-normal"
          autoComplete="off"
          placeholder="Ej: Twin Mill"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <button className={submitClass} disabled={saving || !file}>
        {saving ? "Guardando..." : "Guardar auto"}
      </button>

      {done && <p className="text-center font-bold text-[#3ecf8e]">¡Auto agregado al inventario!</p>}
      {error && <p className="rounded-xl border border-danger/35 bg-danger/10 px-[0.9rem] py-3 text-danger">{error}</p>}
      {!file && !done && <small className={hintClass}>Sin nombre se guarda como “Auto sin nombre”; luego puedes editarlo.</small>}
    </FormPanel>
  );
}
