import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { dataProvider } from "@/lib/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function uploadToMock(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const relativePath = `/uploads/${filename}`;
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(bytes));

  return relativePath;
}

async function uploadToSupabase(file: File) {
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

export async function uploadProductImage(file: File) {
  if (dataProvider === "supabase") {
    return uploadToSupabase(file);
  }

  return uploadToMock(file);
}
