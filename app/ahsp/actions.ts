"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createAHSP(formData: FormData) {
  const nama = formData.get("nama") as string
  const kategori = formData.get("kategori") as string
  const satuan_id = Number.parseInt(formData.get("satuan_id") as string)

  const supabase = createClient()

  const { data, error } = await supabase.from("ahsp").insert([{ nama, kategori, satuan_id }]).select()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/ahsp")

  // Return the ID of the newly created AHSP
  if (data && data.length > 0) {
    return { success: true, id: data[0].id }
  }

  return { success: true }
}

export async function updateAHSP(id: number, formData: FormData) {
  const nama = formData.get("nama") as string
  const kategori = formData.get("kategori") as string
  const satuan_id = Number.parseInt(formData.get("satuan_id") as string)

  const supabase = createClient()

  const { error } = await supabase.from("ahsp").update({ nama, kategori, satuan_id }).eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/ahsp")
  return { success: true }
}

export async function deleteAHSP(id: number) {
  const supabase = createClient()

  // First delete all AHSP details
  await supabase.from("ahsp_detail").delete().eq("ahsp_id", id)

  // Then delete the AHSP
  const { error } = await supabase.from("ahsp").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/ahsp")
  return { success: true }
}

export async function createAHSPDetail(formData: FormData) {
  const ahsp_id = Number.parseInt(formData.get("ahsp_id") as string)
  const type = formData.get("type") as string
  const koefisien = Number.parseFloat(formData.get("koefisien") as string)

  let tukang_id = null
  let material_id = null

  if (type === "tukang") {
    tukang_id = Number.parseInt(formData.get("item_id") as string)
  } else {
    material_id = Number.parseInt(formData.get("item_id") as string)
  }

  const supabase = createClient()

  const { error } = await supabase.from("ahsp_detail").insert([{ ahsp_id, tukang_id, material_id, koefisien }])

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/ahsp/detail/${ahsp_id}`)
  return { success: true }
}

export async function deleteAHSPDetail(id: number, ahsp_id: number) {
  const supabase = createClient()

  const { error } = await supabase.from("ahsp_detail").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/ahsp/detail/${ahsp_id}`)
  return { success: true }
}
