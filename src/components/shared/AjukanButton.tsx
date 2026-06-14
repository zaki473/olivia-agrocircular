"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  type: "barter" | "pembelian";
  limbahId: string;
  className?: string;
  children: React.ReactNode;
};

export default function AjukanButton({ type, limbahId, className, children }: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handleClick = () => {
    const target = type === "barter"
      ? "/dashboard/petani/ajukan-barter"
      : "/dashboard/petani/ajukan-pembelian";

    sessionStorage.setItem(
      type === "barter" ? "barter_target_id" : "jual_target_id",
      limbahId
    );

    if (!isLoggedIn) {
      sessionStorage.setItem("redirect_after_login", target);
      router.push("/login");
      return;
    }

    router.push(target);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}