import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AHSPDetailTable } from "./ahsp-detail-table"
import { AddAHSPDetailForm } from "./add-ahsp-detail-form"

interface AHSPDetailPageProps {
  params: {
    id: string
  }
}

export default async function AHSPDetailPage({ params }: AHSPDetailPageProps) {
  const supabase = createClient()

  // Fetch AHSP
  const { data: ahsp, error: ahspError } = await supabase
    .from("ahsp")
    .select(`
      *,
      satuan:satuan_id (
        nama,
        simbol
      )
    `)
    .eq("id", params.id)
    .single()

  if (ahspError || !ahsp) {
    notFound()
  }

  // Fetch AHSP details
  const { data: ahspDetails, error: detailsError } = await supabase
    .from("ahsp_detail")
    .select(`
      *,
      tukang:tukang_id (*),
      material:material_id (
        *,
        satuan:satuan_id (
          nama,
          simbol
        )
      )
    `)
    .eq("ahsp_id", params.id)

  if (detailsError) {
    console.error("Error fetching AHSP details:", detailsError)
  }

  // Separate tukang and material details
  const tukangDetails = ahspDetails?.filter((detail) => detail.tukang_id !== null) || []
  const materialDetails = ahspDetails?.filter((detail) => detail.material_id !== null) || []

  // Calculate total costs
  const calculateTukangCost = (detail: any) => {
    return detail.tukang.harga_per_hari * detail.koefisien
  }

  const calculateMaterialCost = (detail: any) => {
    return detail.material.harga_satuan * detail.koefisien
  }

  const totalTukangCost = tukangDetails.reduce((sum, detail) => sum + calculateTukangCost(detail), 0)
  const totalMaterialCost = materialDetails.reduce((sum, detail) => sum + calculateMaterialCost(detail), 0)
  const totalCost = totalTukangCost + totalMaterialCost

  // Fetch available tukang and material for the form
  const { data: tukangList } = await supabase.from("tukang").select("*").order("nama")

  const { data: materialList } = await supabase
    .from("material")
    .select(`
      *,
      satuan:satuan_id (
        nama,
        simbol
      )
    `)
    .order("nama")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/ahsp">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Detail AHSP</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ahsp.nama}</CardTitle>
          <CardDescription>
            Kategori: {ahsp.kategori} | Satuan: {ahsp.satuan.nama} ({ahsp.satuan.simbol})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Biaya Tukang</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalTukangCost)}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Biaya Material</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalMaterialCost)}
              </div>
            </div>
            <div className="rounded-lg border p-3 bg-primary/10">
              <div className="text-sm font-medium text-muted-foreground">Total Biaya</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalCost)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tukang</CardTitle>
              <CardDescription>Daftar tukang yang dibutuhkan</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AHSPDetailTable details={tukangDetails} type="tukang" ahspId={Number.parseInt(params.id)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Material</CardTitle>
              <CardDescription>Daftar material yang dibutuhkan</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AHSPDetailTable details={materialDetails} type="material" ahspId={Number.parseInt(params.id)} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Item</CardTitle>
          <CardDescription>Tambahkan tukang atau material ke AHSP ini</CardDescription>
        </CardHeader>
        <CardContent>
          <AddAHSPDetailForm
            ahspId={Number.parseInt(params.id)}
            tukangList={tukangList || []}
            materialList={materialList || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
