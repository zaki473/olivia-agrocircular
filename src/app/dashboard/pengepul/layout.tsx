import Navbar from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PengepulLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["pengepul"]}>
      <div className="min-h-screen bg-[#f8faf8]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}