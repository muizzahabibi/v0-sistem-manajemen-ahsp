"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Database } from "@/lib/types"
import { useState } from "react"
import { createAHSPDetail } from "../../actions"
import { useToast } from "@/hooks/use-toast"

type Tukang = Database["public"]["Tables"]["tukang"]["Row"]
type Material = {
  id: number
  nama: string
  satuan_id: number
  harga_satuan: number
  satuan: {
    nama: string
    simbol: string
  }
}

interface AddAHSPDetailFormProps {
  ahspId: number
  tukangList: Tukang[]
  materialList: Material[]
}

export function AddAHSPDetailForm({ ahspId, tukangList, materialList }: AddAHSPDetailFormProps) {
  const [type, setType] = useState<"tukang" | "material">("tukang")
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [koefisien, setKoefisien] = useState<string>("1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItem) {
      toast({
        title: "Error",
        description: `Pilih ${type === "tukang" ? "tukang" : "material"} terlebih dahulu`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("ahsp_id", ahspId.toString())
    formData.append("type", type)
    formData.append("item_id", selectedItem)
    formData.append("koefisien", koefisien)

    const result = await createAHSPDetail(formData)

    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Berhasil",
        description: `${type === "tukang" ? "Tukang" : "Material"} berhasil ditambahkan ke AHSP`,
      })
      setSelectedItem("")
      setKoefisien("1")
    } else {
      toast({
        title: "Error",
        description: result.error || "Gagal menambahkan item",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={type} onValueChange={(value) => setType(value as "tukang" | "material")}>
        <TabsList className="mb-4">
          <TabsTrigger value="tukang">Tukang</TabsTrigger>
          <TabsTrigger value="material">Material</TabsTrigger>
        </TabsList>

        <TabsContent value="tukang" className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="tukang">Tukang</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tukang" />
              </SelectTrigger>
              <SelectContent>
                {tukangList.map((tukang) => (
                  <SelectItem key={tukang.id} value={tukang.id.toString()}>
                    {tukang.nama} - {tukang.jabatan} (
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(tukang.harga_per_hari)}
                    /hari)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="koefisien">Koefisien (OH)</Label>
            <Input
              id="koefisien"
              type="number"
              step="0.01"
              min="0.01"
              value={koefisien}
              onChange={(e) => setKoefisien(e.target.value)}
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="material" className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="material">Material</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih material" />
              </SelectTrigger>
              <SelectContent>
                {materialList.map((material) => (
                  <SelectItem key={material.id} value={material.id.toString()}>
                    {material.nama} - {material.satuan.simbol} (
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(material.harga_satuan)}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="koefisien">Koefisien</Label>
            <Input
              id="koefisien"
              type="number"
              step="0.01"
              min="0.01"
              value={koefisien}
              onChange={(e) => setKoefisien(e.target.value)}
              required
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Tambah Item"}
        </Button>
      </div>
    </form>
  )
}
