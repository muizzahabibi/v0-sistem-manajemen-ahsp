"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createProyek(formData: FormData) {
  const nama = formData.get("nama") as string
  const lokasi = formData.get("lokasi") as string
  const luas = Number.parseFloat(formData.get("luas") as string)
  const tanggal_mulai = formData.get("tanggal_mulai") as string
  const tanggal_selesai = formData.get("tanggal_selesai") as string
  const status = formData.get("status") as string

  const supabase = createClient()

  const { data, error } = await supabase
    .from("proyek")
    .insert([{ nama, lokasi, luas, tanggal_mulai, tanggal_selesai, status }])
    .select()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/proyek")

  // Return the ID of the newly created proyek
  if (data && data.length > 0) {
    return { success: true, id: data[0].id }
  }

  return { success: true }
}

export async function updateProyek(id: number, formData: FormData) {
  const nama = formData.get("nama") as string
  const lokasi = formData.get("lokasi") as string
  const luas = Number.parseFloat(formData.get("luas") as string)
  const tanggal_mulai = formData.get("tanggal_mulai") as string
  const tanggal_selesai = formData.get("tanggal_selesai") as string
  const status = formData.get("status") as string

  const supabase = createClient()

  const { error } = await supabase
    .from("proyek")
    .update({ nama, lokasi, luas, tanggal_mulai, tanggal_selesai, status })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/proyek")
  return { success: true }
}

export async function deleteProyek(id: number) {
  const supabase = createClient()

  // First check if there are any RABs for this project
  const { data: rabs } = await supabase.from("rab").select("id").eq("proyek_id", id)

  // If there are RABs, delete their details first
  if (rabs && rabs.length > 0) {
    for (const rab of rabs) {
      await supabase.from("rab_detail").delete().eq("rab_id", rab.id)
    }

    // Then delete the RABs
    await supabase.from("rab").delete().eq("proyek_id", id)
  }

  // Finally delete the project
  const { error } = await supabase.from("proyek").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/proyek")
  return { success: true }
}
