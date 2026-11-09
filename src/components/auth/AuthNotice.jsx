import { CircleCheck } from "lucide-react";

/** Aviso de éxito (verde) para las pantallas públicas. */
export default function AuthNotice({ children }) {
  if (!children) return null;

  return (
    <div
      role="status"
      className="mb-5 flex items-start gap-[0.6rem] rounded-xl border border-[#3ecf8e]/35 bg-[#3ecf8e]/10 px-[0.9rem] py-3 text-[0.9rem] text-[#3ecf8e]"
    >
      <CircleCheck size={18} className="mt-[0.1rem] flex-none" />
      {children}
    </div>
  );
}
