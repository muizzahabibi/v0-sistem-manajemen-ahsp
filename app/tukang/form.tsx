"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Database } from "@/lib/types"
import { createTukang, updateTukang } from "./actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

type Tukang = Database["public"]["Tables"]["tukang"]["Row"]

interface TukangFormProps {
  tukang?: Tukang
}

export function TukangForm({ tukang }: TukangFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!tukang
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      if (isEditing) {
        const result = await updateTukang(tukang.id, formData)
        if (result.success) {
          toast({
            title: "Berhasil",
            description: "Data tukang berhasil diperbarui",
          })
          router.push("/tukang")
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan saat memperbarui data tukang",
            variant: "destructive",
          })
        }
      } else {
        const result = await createTukang(formData)
        if (result.success) {
          toast({
            title: "Berhasil",
            description: "Tukang berhasil ditambahkan",
          })
          router.push("/tukang")
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan saat menambahkan tukang",
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
            <Label htmlFor="nama">Nama</Label>
            <Input id="nama" name="nama" defaultValue={tukang?.nama || ""} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="jabatan">Jabatan</Label>
            <Input id="jabatan" name="jabatan" defaultValue={tukang?.jabatan || ""} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="harga_per_hari">Harga Per Hari (Rp)</Label>
            <Input
              id="harga_per_hari"
              name="harga_per_hari"
              type="number"
              defaultValue={tukang?.harga_per_hari || ""}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Tukang"}
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
