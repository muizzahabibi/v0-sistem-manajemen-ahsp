"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTukang(formData: FormData) {
  const nama = formData.get("nama") as string
  const jabatan = formData.get("jabatan") as string
  const harga_per_hari = Number.parseFloat(formData.get("harga_per_hari") as string)

  const supabase = createClient()

  const { error } = await supabase.from("tukang").insert([{ nama, jabatan, harga_per_hari }])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/tukang")
  return { success: true }
}

export async function updateTukang(id: number, formData: FormData) {
  const nama = formData.get("nama") as string
  const jabatan = formData.get("jabatan") as string
  const harga_per_hari = Number.parseFloat(formData.get("harga_per_hari") as string)

  const supabase = createClient()

  const { error } = await supabase.from("tukang").update({ nama, jabatan, harga_per_hari }).eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/tukang")
  return { success: true }
}

export async function deleteTukang(id: number) {
  const supabase = createClient()

  const { error } = await supabase.from("tukang").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/tukang")
  return { success: true }
}
