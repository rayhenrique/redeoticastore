import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function uploadProductImage(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filepath = `products/${filename}`;

  const supabase = await createServerSupabaseClient();
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("products")
    .upload(filepath, Buffer.from(bytes), {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("products").getPublicUrl(filepath);
  return data.publicUrl;
}
