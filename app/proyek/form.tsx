"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Database } from "@/lib/types"
import { createProyek, updateProyek } from "./actions"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

type Proyek = Database["public"]["Tables"]["proyek"]["Row"]

interface ProyekFormProps {
  proyek?: Proyek
}

export function ProyekForm({ proyek }: ProyekFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!proyek
  const [status, setStatus] = useState<string>(proyek?.status || "draft")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy-MM-dd")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set("status", status)

    try {
      if (isEditing) {
        const result = await updateProyek(proyek.id, formData)
        if (result.success) {
          toast({
            title: "Berhasil",
            description: "Proyek berhasil diperbarui",
          })
          router.push("/proyek")
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan saat memperbarui proyek",
            variant: "destructive",
          })
        }
      } else {
        const result = await createProyek(formData)
        if (result.success) {
          toast({
            title: "Berhasil",
            description: "Proyek berhasil ditambahkan",
          })
          if (result.id) {
            router.push(`/rab/proyek/${result.id}`)
          } else {
            router.push("/proyek")
          }
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan saat menambahkan proyek",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan pada sistem",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nama">Nama Proyek</Label>
            <Input id="nama" name="nama" defaultValue={proyek?.nama || ""} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lokasi">Lokasi</Label>
            <Input id="lokasi" name="lokasi" defaultValue={proyek?.lokasi || ""} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="luas">Luas (m²)</Label>
            <Input id="luas" name="luas" type="number" step="0.01" min="0" defaultValue={proyek?.luas || ""} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
            <Input
              id="tanggal_mulai"
              name="tanggal_mulai"
              type="date"
              defaultValue={proyek ? formatDateForInput(proyek.tanggal_mulai) : ""}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
            <Input
              id="tanggal_selesai"
              name="tanggal_selesai"
              type="date"
              defaultValue={proyek ? formatDateForInput(proyek.tanggal_selesai) : ""}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="proses">Proses</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Proyek"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
