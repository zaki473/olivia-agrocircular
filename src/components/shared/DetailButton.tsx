"use client";
import { useRouter } from "next/navigation";

export default function DetailButton({ id }: { id: number }) {
  const router = useRouter();

  const handleClick = () => {
    sessionStorage.setItem("selected_limbah_id", String(id));
    router.push("/pasar-barter/detail");
  };

  return (
    <button
      onClick={handleClick}
      className="block w-full text-center border border-green-600 text-green-700 text-xs font-medium py-1.5 rounded-lg mt-2 hover:bg-green-50 transition"
    >
      Lihat Detail
    </button>
  );
}