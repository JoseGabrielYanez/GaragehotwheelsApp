import { useRef, useState } from "react";
import { api } from "../../api";
import uploadCar from "../../assets/upload-car.png";
import wheelFlame from "../../assets/wheel-flame.png";
import { nameFromFile } from "../../utils/files";
import { prepareImageForUpload } from "../../utils/image";
import FormPanel from "./FormPanel";
import { dropZoneClass, labelClass, submitClass } from "./styles";
import { getErrorMessage } from "../../utils/errors";

const emptyForm = { name: "", autoName: "", notes: "", file: null, preview: "" };

/** Registro manual de un auto (escritorio). En móvil se oculta y se usa la cámara. */
export default function CarUploadForm({ onStart, onCreated, onFail }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    if (form.preview) URL.revokeObjectURL(form.preview);

    // El nombre del archivo pasa al campo "Nombre del auto" (sin pisar uno escrito a mano)
    const guessed = nameFromFile(file.name);
    setForm((current) => ({
      ...current,
      file,
      preview: URL.createObjectURL(file),
      name: !current.name.trim() || current.name === current.autoName ? guessed : current.name,
      autoName: guessed
    }));

    // Foco y texto seleccionado: Enter guarda tal cual, o se escribe encima para cambiarlo
    setTimeout(() => {
      nameRef.current?.focus();
      nameRef.current?.select();
    }, 0);
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.file || !form.name.trim()) return;

    setSaving(true);
    setError("");

    // La tarjeta aparece de inmediato en el inventario con la foto local mientras se sube
    const pendingId = onStart?.({ name: form.name.trim(), notes: form.notes, previewUrl: form.preview });

    try {
      const body = new FormData();
      body.append("image", await prepareImageForUpload(form.file));
      body.append("name", form.name);
      body.append("notes", form.notes);

      const { data } = await api.post("/cars", body, { headers: { "Content-Type": "multipart/form-data" } });
      onCreated(data.car, pendingId);
      if (form.preview) URL.revokeObjectURL(form.preview);
      setForm(emptyForm);
    } catch (err) {
      onFail?.(pendingId); // se quita la tarjeta provisional; el formulario conserva lo escrito para reintentar
      setError(getErrorMessage(err, "No se pudo guardar el auto. Intenta de nuevo."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormPanel
      className="compact:hidden"
      onSubmit={submit}
      kicker="Registro manual"
      title="Agregar bólido"
      icon={<img src={wheelFlame} alt="" draggable={false} className="h-[1.7rem] w-auto flex-none invert light:invert-0" />}
    >
      <label className={dropZoneClass}>
        <input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleFile(event.target.files?.[0])} />
        {form.preview ? (
          <img className="h-25w-full object-cover" src={form.preview} alt="Preview del auto" />
        ) : (
          <span className="grid place-items-center gap-[0.55rem] font-semibold">
            <img
              className="w-25 max-w-full object-contain drop-shadow-[0_0.4rem_0.8rem_rgba(0,0,0,0.35)]"
              src={uploadCar}
              alt=""
              draggable={false}
            />
            Cargar foto
          </span>
        )}
      </label>

      <label className={labelClass}>
        Nombre del auto
        <input
          ref={nameRef}
          className="field field-tread font-normal"
          autoComplete="off"
          placeholder="Ej: Twin Mill, '69 Charger, etc."
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
      </label>

      <label className={labelClass}>
        Notas Adicionales
        <textarea
          className="field min-h-[5.5rem] resize-y font-normal"
          placeholder="Color, estado, variaciones..."
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
        />
      </label>

      <button className={submitClass} disabled={saving || !form.file || !form.name.trim()}>
        {saving ? "Guardando..." : "¡Añadir al Garage de Colección!"}
      </button>

      {error && <p role="alert" className="rounded-xl border border-danger/35 bg-danger/10 px-[0.9rem] py-3 text-danger">{error}</p>}
    </FormPanel>
  );
}
