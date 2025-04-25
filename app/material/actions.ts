"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMaterial(formData: FormData) {
  const nama = formData.get("nama") as string
  const satuan_id = Number.parseInt(formData.get("satuan_id") as string)
  const harga_satuan = Number.parseFloat(formData.get("harga_satuan") as string)

  const supabase = createClient()

  const { error } = await supabase.from("material").insert([{ nama, satuan_id, harga_satuan }])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/material")
  return { success: true }
}

export async function updateMaterial(id: number, formData: FormData) {
  const nama = formData.get("nama") as string
  const satuan_id = Number.parseInt(formData.get("satuan_id") as string)
  const harga_satuan = Number.parseFloat(formData.get("harga_satuan") as string)

  const supabase = createClient()

  const { error } = await supabase.from("material").update({ nama, satuan_id, harga_satuan }).eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/material")
  return { success: true }
}

export async function deleteMaterial(id: number) {
  const supabase = createClient()

  const { error } = await supabase.from("material").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/material")
  return { success: true }
}
