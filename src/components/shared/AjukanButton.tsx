"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  type: "barter" | "pembelian";
  limbahId: number;
  className?: string;
  children: React.ReactNode;
};

export default function AjukanButton({ type, limbahId, className, children }: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handleClick = () => {
    if (!isLoggedIn) {
      // Simpan tujuan setelah login
      const target = type === "barter"
        ? "/dashboard/petani/ajukan-barter"
        : "/dashboard/petani/ajukan-pembelian";

      sessionStorage.setItem("redirect_after_login", target);
      sessionStorage.setItem(
        type === "barter" ? "barter_target_id" : "jual_target_id",
        String(limbahId)
      );
      router.push("/login");
      return;
    }

    // Sudah login, lanjut seperti biasa
    sessionStorage.setItem(
      type === "barter" ? "barter_target_id" : "jual_target_id",
      String(limbahId)
    );
    router.push(type === "barter" ? "/dashboard/petani/ajukan-barter" : "/dashboard/petani/ajukan-pembelian");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}