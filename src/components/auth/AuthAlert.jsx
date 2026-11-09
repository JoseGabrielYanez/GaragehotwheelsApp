import { CircleAlert } from "lucide-react";

export default function AuthAlert({ children }) {
  if (!children) return null;

  return (
    <div role="alert" className="flex items-start gap-[0.6rem] rounded-xl border border-danger/35 bg-danger/10 px-[0.9rem] py-3 text-[0.9rem] text-danger">
      <CircleAlert size={18} className="mt-[0.1rem] flex-none" />
      {children}
    </div>
  );
}
