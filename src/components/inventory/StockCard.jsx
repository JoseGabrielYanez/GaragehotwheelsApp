import { useState } from "react";
import { Check, Edit3, LoaderCircle, PackageCheck, Palette, ShieldCheck, Tag, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../api";
import CarImage from "../ui/CarImage";
import { parseFeatures } from "../../utils/cars";
import { stockCardClass, stockPhotoClass } from "./styles";

const featureIcons = [Tag, Palette, PackageCheck, ShieldCheck];
const actionBtn = "icon-btn size-[2.3rem] border-white/[0.16] bg-black/50 text-white";

export default function StockCard({ car, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: car.name, notes: car.notes || "" });
  const features = parseFeatures(car.notes);
  const pending = Boolean(car.pending); // se está subiendo: muestra la foto local con un indicador de progreso

  async function save() {
    const { data } = await api.put(`/cars/${car._id}`, draft);
    onUpdate(data.car);
    setEditing(false);
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`group/card transition-[box-shadow,border-color] duration-200 hover:border-accent/55 hover:shadow-[0_1.4rem_3.2rem_rgba(255,90,31,0.18)] ${stockCardClass}`}
    >
      <div className="grid flex-1 content-start gap-[0.55rem] px-[0.4rem] pt-[0.35rem] pb-3 max-sm:px-[0.3rem] max-sm:pb-[0.55rem]">
        {editing ? (
          <input
            className="field px-3 py-[0.55rem]"
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          />
        ) : (
          <h3 className="text-[1.05rem] leading-[1.2] font-bold text-fg [overflow-wrap:anywhere] max-sm:text-[0.92rem]">
            {car.name}
          </h3>
        )}

        {editing && (
          <textarea
            className="field min-h-[4.5rem] resize-y"
            placeholder="Caracteristicas separadas por coma: rojo, serie 90s, nuevo, blister sellado"
            value={draft.notes}
            onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
          />
        )}

        {pending && (
          <span className="inline-flex w-fit items-center gap-[0.4rem] rounded-full border border-accent/40 bg-accent/10 px-[0.6rem] py-1 text-[0.76rem] font-semibold text-accent">
            <LoaderCircle size={12} className="animate-spin" /> Guardando...
          </span>
        )}

        {!editing && features.length > 0 && (
          <div className="flex flex-wrap gap-[0.4rem]">
            {features.map((feature, index) => {
              const Icon = featureIcons[index] || Tag;
              return (
                <span
                  key={`${car._id}-${feature}`}
                  className="inline-flex max-w-full items-center gap-[0.35rem] rounded-full border border-line bg-panel px-[0.6rem] py-1 text-[0.76rem] font-semibold text-muted [overflow-wrap:anywhere]"
                >
                  <Icon className="size-[0.85rem] flex-none text-accent" size={22} />
                  {feature}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className={`[--car-pad:0.5rem] ${stockPhotoClass}`}>
        {pending ? (
          <>
            <img src={car.previewUrl} alt="" aria-hidden="true" className="absolute -inset-[12%] size-[124%] object-cover blur-[20px] brightness-[0.8]" />
            <img src={car.previewUrl} alt={car.name} className="absolute inset-0 size-full object-contain" />
            <div className="absolute inset-0 grid place-items-center bg-black/35">
              <LoaderCircle size={30} className="animate-spin text-white" />
            </div>
          </>
        ) : (
          <CarImage car={car} lazy />
        )}

        {!pending && (
        <div className="absolute top-[0.7rem] right-[0.7rem] z-[2] flex -translate-y-1 gap-[0.4rem] opacity-0 transition duration-[180ms] group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100 touch:translate-y-0 touch:opacity-100">
          {editing ? (
            <>
              <button className={actionBtn} onClick={save} title="Guardar" type="button">
                <Check size={18} />
              </button>
              <button className={actionBtn} onClick={() => setEditing(false)} title="Cancelar" type="button">
                <X size={18} />
              </button>
            </>
          ) : (
            <button className={actionBtn} onClick={() => setEditing(true)} title="Editar" type="button">
              <Edit3 size={18} />
            </button>
          )}
          <button className={`${actionBtn} text-[#ff8da0]`} onClick={() => onDelete(car._id)} title="Eliminar" type="button">
            <Trash2 size={18} />
          </button>
        </div>
        )}
      </div>
    </motion.article>
  );
}
