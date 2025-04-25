"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Database } from "@/lib/types"
import { createMaterial, updateMaterial } from "./actions"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

type Material = Database["public"]["Tables"]["material"]["Row"]
type Satuan = Database["public"]["Tables"]["satuan"]["Row"]

interface MaterialFormProps {
  material?: Material
}

export function MaterialForm({ material }: MaterialFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!material
  const [satuanList, setSatuanList] = useState<Satuan[]>([])
  const [selectedSatuan, setSelectedSatuan] = useState<string>(material?.satuan_id.toString() || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSatuan = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("satuan").select("*").order("nama")

      if (data) {
        setSatuanList(data)
        if (!isEditing && data.length > 0) {
          setSelectedSatuan(data[0].id.toString())
        }
      }
    }

    fetchSatuan()
  }, [isEditing])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set("satuan_id", selectedSatuan)

    try {
      if (isEditing) {
        const result = await updateMaterial(material.id, formData)
        if (result.success) {
          toast({
            title: "Berhasil",
            description: "Material berhasil diperbarui",
          })
          router.push("/material")
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan saat memperbarui material",
            variant: "destructive",
          })
        }
      } else {
        const result = await createMaterial(formData)
        if (result.success) {
          toast({
            title: "Berhasil",
            description: "Material berhasil ditambahkan",
          })
          router.push("/material")
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan saat menambahkan material",
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
            <Label htmlFor="nama">Nama Material</Label>
            <Input id="nama" name="nama" defaultValue={material?.nama || ""} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="satuan_id">Satuan</Label>
            <Select value={selectedSatuan} onValueChange={setSelectedSatuan} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih satuan" />
              </SelectTrigger>
              <SelectContent>
                {satuanList.map((satuan) => (
                  <SelectItem key={satuan.id} value={satuan.id.toString()}>
                    {satuan.nama} ({satuan.simbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="harga_satuan">Harga Satuan (Rp)</Label>
            <Input
              id="harga_satuan"
              name="harga_satuan"
              type="number"
              defaultValue={material?.harga_satuan || ""}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Material"}
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
