import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { RABDetailTable } from "./rab-detail-table"
import { AddRABDetailForm } from "./add-rab-detail-form"

interface RABDetailPageProps {
  params: {
    id: string
  }
}

export default async function RABDetailPage({ params }: RABDetailPageProps) {
  const supabase = createClient()

  // Fetch RAB with project
  const { data: rab, error: rabError } = await supabase
    .from("rab")
    .select(`
      *,
      proyek:proyek_id (*)
    `)
    .eq("id", params.id)
    .single()

  if (rabError || !rab) {
    notFound()
  }

  // Fetch RAB details with AHSP
  const { data: rabDetails, error: detailsError } = await supabase
    .from("rab_detail")
    .select(`
      *,
      ahsp:ahsp_id (
        *,
        satuan:satuan_id (
          nama,
          simbol
        )
      )
    `)
    .eq("rab_id", params.id)
    .order("id")

  if (detailsError) {
    console.error("Error fetching RAB details:", detailsError)
  }

  // Fetch available AHSP for the form
  const { data: ahspList } = await supabase
    .from("ahsp")
    .select(`
      *,
      satuan:satuan_id (
        nama,
        simbol
      )
    `)
    .order("kategori", { ascending: true })
    .order("nama", { ascending: true })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/rab">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Detail RAB</h1>
        <div className="ml-auto flex gap-2">
          <Link href={`/laporan/rab/${params.id}`} target="_blank">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Cetak RAB
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{rab.proyek.nama}</CardTitle>
          <CardDescription>
            Lokasi: {rab.proyek.lokasi} | Luas: {rab.proyek.luas} m² | Status: {rab.proyek.status}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 bg-primary/10">
            <div className="text-sm font-medium text-muted-foreground">Total Biaya RAB</div>
            <div className="text-3xl font-bold">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(rab.total_biaya)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Item RAB</CardTitle>
          <CardDescription>Daftar item AHSP yang digunakan dalam RAB ini</CardDescription>
        </CardHeader>
        <CardContent>
          <RABDetailTable details={rabDetails || []} rabId={Number.parseInt(params.id)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Item RAB</CardTitle>
          <CardDescription>Tambahkan AHSP ke RAB ini</CardDescription>
        </CardHeader>
        <CardContent>
          <AddRABDetailForm rabId={Number.parseInt(params.id)} ahspList={ahspList || []} />
        </CardContent>
      </Card>
    </div>
  )
}
