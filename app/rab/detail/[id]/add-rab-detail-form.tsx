"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { addRABDetail } from "../../actions"
import { useToast } from "@/hooks/use-toast"

type AHSP = {
  id: number
  nama: string
  kategori: string
  satuan_id: number
  satuan: {
    nama: string
    simbol: string
  }
}

interface AddRABDetailFormProps {
  rabId: number
  ahspList: AHSP[]
}

export function AddRABDetailForm({ rabId, ahspList }: AddRABDetailFormProps) {
  const [selectedAHSP, setSelectedAHSP] = useState<string>("")
  const [volume, setVolume] = useState<string>("1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Group AHSP by category
  const ahspByCategory = ahspList.reduce(
    (acc, ahsp) => {
      if (!acc[ahsp.kategori]) {
        acc[ahsp.kategori] = []
      }
      acc[ahsp.kategori].push(ahsp)
      return acc
    },
    {} as Record<string, AHSP[]>,
  )

  const categories = Object.keys(ahspByCategory).sort()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedAHSP) {
      toast({
        title: "Error",
        description: "Pilih AHSP terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("rab_id", rabId.toString())
    formData.append("ahsp_id", selectedAHSP)
    formData.append("volume", volume)

    const result = await addRABDetail(formData)

    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Berhasil",
        description: "Item berhasil ditambahkan ke RAB",
      })
      setSelectedAHSP("")
      setVolume("1")
    } else {
      toast({
        title: "Error",
        description: result.error || "Gagal menambahkan item",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="ahsp">AHSP</Label>
        <Select value={selectedAHSP} onValueChange={setSelectedAHSP}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih AHSP" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectGroup key={category}>
                <SelectLabel>{category}</SelectLabel>
                {ahspByCategory[category].map((ahsp) => (
                  <SelectItem key={ahsp.id} value={ahsp.id.toString()}>
                    {ahsp.nama} ({ahsp.satuan.simbol})
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="volume">Volume</Label>
        <Input
          id="volume"
          type="number"
          step="0.01"
          min="0.01"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Tambah Item"}
      </Button>
    </form>
  )
}
