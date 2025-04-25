"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createRAB(proyek_id: number) {
  const supabase = createClient()

  // Create RAB with initial total_biaya of 0
  const { data, error } = await supabase
    .from("rab")
    .insert([{ proyek_id, total_biaya: 0 }])
    .select()

  if (error) {
    return { success: false, error: error.message }
  }

  if (data && data.length > 0) {
    return { success: true, id: data[0].id }
  }

  return { success: false, error: "Failed to create RAB" }
}

export async function deleteRAB(id: number) {
  const supabase = createClient()

  // First delete all RAB details
  await supabase.from("rab_detail").delete().eq("rab_id", id)

  // Then delete the RAB
  const { error } = await supabase.from("rab").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/rab")
}

export async function addRABDetail(formData: FormData) {
  const rab_id = Number.parseInt(formData.get("rab_id") as string)
  const ahsp_id = Number.parseInt(formData.get("ahsp_id") as string)
  const volume = Number.parseFloat(formData.get("volume") as string)

  const supabase = createClient()

  // Get AHSP details to calculate subtotal
  const { data: ahsp } = await supabase
    .from("ahsp")
    .select(`
      *,
      ahsp_detail:ahsp_detail (
        *,
        tukang:tukang_id (*),
        material:material_id (*)
      )
    `)
    .eq("id", ahsp_id)
    .single()

  if (!ahsp) {
    return { success: false, error: "AHSP not found" }
  }

  // Calculate AHSP unit price
  let ahspUnitPrice = 0

  for (const detail of ahsp.ahsp_detail) {
    if (detail.tukang) {
      ahspUnitPrice += detail.tukang.harga_per_hari * detail.koefisien
    }
    if (detail.material) {
      ahspUnitPrice += detail.material.harga_satuan * detail.koefisien
    }
  }

  // Calculate subtotal
  const subtotal = ahspUnitPrice * volume

  // Insert RAB detail
  const { error } = await supabase.from("rab_detail").insert([{ rab_id, ahsp_id, volume, subtotal }])

  if (error) {
    return { success: false, error: error.message }
  }

  // Update RAB total_biaya
  const { data: rabDetails } = await supabase.from("rab_detail").select("subtotal").eq("rab_id", rab_id)

  const total_biaya = rabDetails?.reduce((sum, detail) => sum + Number.parseFloat(detail.subtotal), 0) || 0

  await supabase.from("rab").update({ total_biaya }).eq("id", rab_id)

  revalidatePath(`/rab/detail/${rab_id}`)
  return { success: true }
}

export async function deleteRABDetail(id: number, rab_id: number) {
  const supabase = createClient()

  // Delete RAB detail
  const { error } = await supabase.from("rab_detail").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  // Update RAB total_biaya
  const { data: rabDetails } = await supabase.from("rab_detail").select("subtotal").eq("rab_id", rab_id)

  const total_biaya = rabDetails?.reduce((sum, detail) => sum + Number.parseFloat(detail.subtotal), 0) || 0

  await supabase.from("rab").update({ total_biaya }).eq("id", rab_id)

  revalidatePath(`/rab/detail/${rab_id}`)
  return { success: true }
}
