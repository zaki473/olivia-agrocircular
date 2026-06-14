import { createClient } from "@/lib/supabase/client";

export async function uploadDokumen(userId: string, file: File, jenis: "ktp" | "usaha"): Promise<string | null> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${jenis}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage.from("verification-docs").upload(fileName, file, {
    upsert: true,
  });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  // Bucket privat, jadi simpan path-nya saja (bukan public URL)
  return fileName;
}

export async function getDokumenUrl(path: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("verification-docs").createSignedUrl(path, 3600); // valid 1 jam

  if (error) {
    console.error("Signed URL error:", error.message);
    return null;
  }

  return data.signedUrl;
}