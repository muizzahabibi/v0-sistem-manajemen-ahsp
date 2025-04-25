"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Database } from "@/lib/types"
import { createAHSP, updateAHSP } from "./actions"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

type AHSP = Database["public"]["Tables"]["ahsp"]["Row"]
type Satuan = Database["public"]["Tables"]["satuan"]["Row"]

interface AHSPFormProps {
  ahsp?: AHSP
}

export function AHSPForm({ ahsp }: AHSPFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!ahsp
  const [satuanList, setSatuanList] = useState<Satuan[]>([])
  const [selectedSatuan, setSelectedSatuan] = useState<string>(ahsp?.satuan_id.toString() || "")
  const [kategori, setKategori] = useState<string>(ahsp?.kategori || "")
  const [kategoriList, setKategoriList] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch satuan
      const { data: satuanData } = await supabase.from("satuan").select("*").order("nama")

      if (satuanData) {
        setSatuanList(satuanData)
        if (!isEditing && satuanData.length > 0) {
          setSelectedSatuan(satuanData[0].id.toString())
        }
      }

      // Fetch unique categories
      const { data: ahspData } = await supabase.from("ahsp").select("kategori")

      if (ahspData) {
        const uniqueCategories = Array.from(new Set(ahspData.map((item) => item.kategori || "Tanpa Kategori")))
          .filter(Boolean)
          .sort()
        setKategoriList(uniqueCategories)
      }
    }

    fetchData()
  }, [isEditing])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Ensure kategori is not empty
    const finalKategori = kategori.trim() || "Umum"

    const formData = new FormData(e.currentTarget)
    formData.set("satuan_id", selectedSatuan)
    formData.set("kategori", finalKategori)

    try {
      if (isEditing) {
        const result = await updateAHSP(ahsp.id, formData)
        if (result.success) {
          toast({
            title: "Berhasil",
            description: "AHSP berhasil diperbarui",
          })
          router.push("/ahsp")
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan saat memperbarui AHSP",
            variant: "destructive",
          })
        }
      } else {
        const result = await createAHSP(formData)
        if (result.success) {
          toast({
            title: "Berhasil",
            description: "AHSP berhasil ditambahkan",
          })
          if (result.id) {
            router.push(`/ahsp/detail/${result.id}`)
          } else {
            router.push("/ahsp")
          }
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan saat menambahkan AHSP",
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
            <Label htmlFor="nama">Nama AHSP</Label>
            <Input id="nama" name="nama" defaultValue={ahsp?.nama || ""} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="kategori">Kategori</Label>
            <div className="flex gap-2">
              <Select value={kategori} onValueChange={setKategori}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriList.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Atau masukkan kategori baru"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="flex-1"
              />
            </div>
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

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah AHSP"}
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
